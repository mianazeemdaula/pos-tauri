"use client"
import { useEffect, useState } from "react"
import { products, parties } from "@/lib/database";
import { Product, Party, PaymentType } from "@prisma/client";
import { CircleX, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import Label from "@/components/ui/label";
import SearchProductModal from "@/components/dialogs/serach_products";
import hotkeys from "hotkeys-js";
import Select from "@/components/ui/select";
import { PurchaseItem } from "@/lib/datatypes";
import PurchaseItemEditModal from "@/components/dialogs/purchaseitem_edit";
import { Input } from "@/components/ui/input";


export default function SalePage() {

    const [customersList, setCustomerList] = useState<Party[]>([]);
    const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
    const [sellerBalance, setSellerBalance] = useState(0);
    const [productList, setProductList] = useState<Product[]>([]);
    const [itemList, setItemList] = useState<PurchaseItem[]>([])
    const [searchOpen, setSearchOpen] = useState<boolean>(false)
    const [cartItemEditOpen, setCartItemEditOpen] = useState<boolean>(false)
    const [selectedItem, setSelectedItem] = useState<PurchaseItem | null>(null)
    const [paymentTypesList, setPaymentTypes] = useState<PaymentType[]>([])
    const [paymentType, setPaymentType] = useState<number>(1);
    const [cashamount, setCashAmount] = useState<number>(0);
    const [invoiceNo, setInvoiceNo] = useState<String>('');
    const [invoiceDate, setInvoiceDate] = useState<Date | null>(new Date());
    const [purchaseDate, setPurchaseDate] = useState<Date | null>(new Date());

    const totalAmount = itemList.reduce((sum, item) => sum + item.total, 0);
    const totalQty = itemList.reduce((sum, item) => sum + item.qty, 0);
    const totalDiscount = itemList.reduce((sum, item) => sum + item.discount, 0);

    async function getProducts() {
        const p = await products();
        setProductList(p);
    }



    useEffect(() => {
        hotkeys("f2", function (e, handler) {
            e.preventDefault();
            setSearchOpen(!searchOpen);
        });
        return () => {
            hotkeys.unbind("f2");
        };
    }, [searchOpen]);

    useEffect(() => {
        async function getPaymentTypes() {
            const p = await fetch('/api/payment_types');
            const data = await p.json();
            setPaymentTypes(data);
        }
        getPaymentTypes();
        return () => {
            setPaymentTypes([]);
        }
    }, []);

    async function getSellers() {
        const p = await parties();
        if (p.length > 0) {
            setCustomerList(p);
            setSelectedSellerId(p[0].id.toString());
            // if (p[0].ledgers && p[0].ledgers.length > 0) {
            //     setSellerBalance(p[0].ledgers[0]?.balance || 0);
            // }
        }
    }
    useEffect(() => {
        getProducts();
        getSellers();
    }, [])


    const skuScanSubmit = async (event: any) => {
        if (event.key === 'Enter') {
            const sku = event.target.value;
            const product = productList.find((i) => i.code == sku);
            if (product) {
                addToCard(product.id);
            } else {
                toast.error('Product not found');
            }
            // change the value of the input field 
            event.target.value = '';
        }
    };

    async function addToCard(id: Number) {
        const product = productList.find((i) => i.id == id);
        if (product) {
            const cartItem = itemList.find((i) => i.id == product.id);
            if (cartItem) {
                const qty = cartItem.qty + 1;
                const discount = ((cartItem.price * cartItem.discountPercent) / 100) * qty;
                const total = (qty * cartItem.price) - (discount);
                setItemList((prevItems) =>
                    prevItems.map((item) =>
                        item.id === product.id
                            ? { ...item, qty: qty, total: total, discount: discount }
                            : item
                    )
                );

            } else {
                const discount = (product.price * product.discount / 100);
                setItemList((p) => [
                    ...p,
                    {
                        id: product.id,
                        code: product.code,
                        name: product.name,
                        qty: 1,
                        price: product.price,
                        discount: discount,
                        discountPercent: product.discount,
                        total: product.price - discount,
                    }
                ])
            }

        } else {
            toast.error('Product not found');
        }
    }

    function removeFromCart(id: Number) {
        setItemList((prevItems) => prevItems.filter((item) => item.id !== id));
    }

    function openEditModal(item: PurchaseItem) {
        setSelectedItem(item);
        setCartItemEditOpen(true);
    }

    function closeEditModal(item: any) {
        if (item) {
            const qty = item.qty;
            const discount = ((item.price * item.discount) / 100) * qty;
            const total = (qty * item.price) - (discount);
            setItemList((prevItems) =>
                prevItems.map((i) =>
                    i.id === item.id
                        ? { ...i, qty: qty, total: total, discount: discount, discountPercent: item.discount, price: item.price }
                        : i
                )
            );
        }
        setCartItemEditOpen(false);
    }

    async function handlePurchase() {
        try {
            const res = await fetch('/api/purchase', {
                method: 'POST',
                body: JSON.stringify({
                    items: itemList,
                    total: totalAmount,
                    discount: totalDiscount,
                    qty: totalQty,
                    partyId: selectedSellerId,
                    purchaseDate: purchaseDate,
                    invoiceDate: invoiceDate,
                    paymentTypeId: paymentType,
                    cash: cashamount,
                    invoiceNo: invoiceNo,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            toast.success('Purchase completed');
            setItemList([]);
            getSellers();
        } catch (error) {
            toast.error('Error: ' + (error as Error).message);
        }
    }


    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1>Purchase</h1>
                <button
                    className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => { }}
                ><Plus className="h-5 w-5" /> New Purchase
                </button>
            </div>


            <div className="flex items-center justify-between space-x-4 my-2">
                <div className="flex items-center space-x-4 w-3/4">
                    <div>
                        <Label htmlFor="customer_id">Party</Label>
                        <Select name="customer_id" onChange={(e) => {
                            setSelectedSellerId(e.target.value);
                            const customer: any = customersList.find((c) => c.id === Number(e.target.value));
                            if (customer) {
                                setSellerBalance(customer?.wallet?.balance || 0);
                            }
                        }} options={[]}>
                            {customersList.map((c) => (
                                <option key={c.id} value={c.id}> {c.name} </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="customer_id">Invoice #</Label>
                        <Input name="invoiceNo" type="text" onChange={(v) => setInvoiceNo(v.target.value)} placeholder="A0001" />
                    </div>
                    <div>
                        <Label htmlFor="invoiceDate">Invoice Date</Label>
                        <Input name="invoiceDate" type="date" onChange={(v) => setInvoiceDate(v.target.valueAsDate)} />
                    </div>
                    <div>
                        <Label htmlFor="purchaseDate">Purchase Date</Label>
                        <Input name="purchaseDate" type="date" onChange={(v) => setPurchaseDate(v.target.valueAsDate)} />
                    </div>
                </div>
                <div className="w-48 text-right">
                    <Label htmlFor="customer_balance">Balance</Label>
                    <div><span className="font-bold">RS.</span> {sellerBalance}</div>
                </div>
            </div >

            <div className="flex items-center justify-between space-x-4">
                <input type="text" name="" id="" className="w-full px-3 py-2 rounded-md" onKeyDown={skuScanSubmit} placeholder="Enter SKU or F2" />
                <button
                    className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => setSearchOpen(true)}
                ><Search className="h-5 w-5" /> Search
                </button>
            </div>
            <div className="flex items-start justify-between mt-4 space-x-2">
                <table className="table-fixed w-full border-collapse">
                    <thead className="bg-gray-100 text-sm">
                        <tr>
                            <td className="w-1/4 text-left p-2">SKU</td>
                            <td className="w-1/4 text-left p-2">Product</td>
                            <td className="w-1/4 text-left">Price</td>
                            <td className="w-1/4 text-left">Qty</td>
                            <td className="w-1/4 text-left">Discount</td>
                            <td className="w-1/4 text-left">Total</td>
                            <td className="w-1/4 text-center">Action</td>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm bg-white">
                        {itemList.map((item) => (
                            <tr key={item.code} onDoubleClick={() => { openEditModal(item) }}>
                                <td className="p-2">{item.code}</td>
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">{item.price}</td>
                                <td>{item.qty}</td>
                                <td>{item.discount} ({item.discountPercent}%)</td>
                                <td>{item.total}</td>
                                <td className="text-center">
                                    <button onClick={() => removeFromCart(item.id)} >
                                        <CircleX className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table >
                <div className="bg-white w-64 p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm">Total </div>
                        <div className="text-xl">{totalAmount.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">Discount </div>
                        <div className="text-xl">{totalDiscount.toFixed(2)}</div>
                    </div>
                    <hr className="my-1 border-dotted" />
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-bold">Net Total </div>
                        <div className="text-xl font-bold">{(totalAmount - totalDiscount).toFixed(2)}</div>
                    </div>
                    <hr className="my-1 border-dotted" />
                    <div className="flex items-center justify-between">
                        <div className="text-sm">Quantity </div>
                        <div className="text-xl">{totalQty}</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">Items Count </div>
                        <div className="text-xl">{itemList.length}</div>
                    </div>
                    <hr className="my-4 border-dotted" />
                    <div>
                        <Label htmlFor="payment_type">Payment Type</Label>
                        <Select name="payment_type" id="payment_type" options={[]} onChange={(e) => setPaymentType(Number(e.target.value))}>
                            {paymentTypesList.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="cashamount">Cash Amount</Label>
                        <Input type="number" id="cashamount" name="cashamount" onChange={(e) => {
                            setCashAmount(Number(e.target.value));
                        }} />
                    </div>
                    <div>
                        <button className="bg-secondary text-white px-4 py-2 rounded-md mt-4 w-full" onClick={handlePurchase}>Purchase</button>
                    </div>
                </div>
            </div>
            <SearchProductModal isOpen={searchOpen} onClose={(e) => {
                setSearchOpen(false);
                if (e) {
                    addToCard(e.id);
                }
            }} />

            <PurchaseItemEditModal isOpen={cartItemEditOpen} onClose={closeEditModal} initialData={selectedItem} />
        </>
    )
}