"use client"
import { useEffect, useState } from "react"
import { Party, PaymentType, Product } from "@prisma/client";
import { CircleX, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import Label from "@/components/ui/label";
import SearchProductModal from "@/components/dialogs/serach_products";
import CartItemEditModal from "@/components/dialogs/cartitem_edit";
import { SaleItem } from "@/lib/datatypes";
import SearchPartyModal from "@/components/dialogs/serach_party";
import Select from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function SalePage() {

    const [selectParty, setSelectedParty] = useState<Party | null>(null);
    const [itemList, setItemList] = useState<SaleItem[]>([])
    const [paymentTypesList, setPaymentTypes] = useState<PaymentType[]>([])
    const [paymentType, setPaymentType] = useState<number>(1);
    const [searchOpen, setSearchOpen] = useState(false);
    const [partySearchOpen, setPartySearchOpen] = useState(false);
    const [cartItemEditOpen, setCartItemEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<SaleItem | null>(null);
    const [changeAmount, setChangeAmount] = useState<number>(0);
    const [cashamount, setCashAmount] = useState<number>(0);
    const [discount2, setDiscount2] = useState<number>(0);

    const totalAmount = itemList.reduce((sum, item) => sum + item.total, 0);
    const totalQty = itemList.reduce((sum, item) => sum + item.qty, 0);
    const totalDiscount = itemList.reduce((sum, item) => sum + item.discount, 0);
    const totalTax = itemList.reduce((sum, item) => sum + item.tax, 0);


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

    async function findProduct(sku: string) {
        const product = await fetch('/api/product/' + sku);
        if (!product.ok) {
            toast.error('Product not found');
            return null;
        }
        const data = await product.json();
        return data;
    }


    const skuScanSubmit = async (event: any) => {
        if (event.key === 'Enter') {
            const sku = event.target.value;
            findProduct(sku).then((product) => {
                if (product) {
                    addToCard(product);
                    event.target.value = '';
                }
            })
        }
    };

    async function addToCard(product: Product) {
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
                    sku: product.code,
                    name: product.name,
                    qty: 1,
                    price: product.price,
                    discount: discount,
                    tax: product.tax * product.price / 100,
                    discountPercent: product.discount,
                    total: product.price - discount,
                }
            ])
        }
    }

    async function handleSale() {
        try {
            const res = await fetch('/api/sale', {
                method: 'POST',
                body: JSON.stringify({
                    items: itemList,
                    total: totalAmount,
                    discount: totalDiscount,
                    discount2: discount2,
                    qty: totalQty,
                    partyId: selectParty?.id,
                    paymentTypeId: paymentType,
                    cash: cashamount,
                    tax: totalTax,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            const data = await res.json();
            const salePrintRes = await fetch("http://127.0.0.1:5000/print", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!salePrintRes.ok) {
                const d = await salePrintRes.json();
                toast.error('Error: ' + d.error);
            }
            toast.success('Sale completed');
            window.location.reload();
        } catch (error) {
            toast.error('Error: ' + (error as Error).message);
        }
    }

    function openEditModal(item: SaleItem) {
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



    return (
        <>
            <div className="flex items-center justify-between space-x-4 my-2">
                <div>
                    <div className="flex items-center gap-x-2">
                        <button onClick={() => setPartySearchOpen(!partySearchOpen)} className="bg-gray-100 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary transition-colors hover:text-white">Search Party</button>
                        {selectParty &&
                            <div>
                                <div className="text-sm">{selectParty?.name}</div>
                                <div className="text-sm">{selectParty?.phone}</div>
                            </div>
                        }
                    </div>

                </div>

                <div>
                    <button
                        className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                        onClick={() => {
                            // reload the page
                            window.location.reload();
                        }}
                    ><Plus className="h-5 w-5" /> New Sale
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between space-x-4">
                <input type="text" className="w-full px-3 py-2 rounded-md" onKeyDown={skuScanSubmit} placeholder="SKU or scan barcode" />
                <button
                    className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => { setSearchOpen(!searchOpen) }}
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
                    <tbody className="divide-y divide-gray-200 text-xs bg-white">
                        {itemList.map((sale) => (
                            <tr key={sale.id} onDoubleClick={() => { openEditModal(sale) }}>
                                <td className="p-2">{sale.sku}</td>
                                <td className="p-2">{sale.name}</td>
                                <td className="p-2">{sale.price}</td>
                                <td>{sale.qty}</td>
                                <td>{sale.discount} ({sale.discountPercent}%)</td>
                                <td>{sale.total}</td>
                                <td className="text-center">
                                    <button onClick={() => {
                                        setItemList((prevItems) => prevItems.filter((item) => item.id !== sale.id));
                                    }} >
                                        <CircleX className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table >
                <div className="bg-white w-4/12 p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm">Total </div>
                        <div className="text-xl">{totalAmount.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">Discount </div>
                        <div className="text-xl">{totalDiscount.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">Discount2 </div>
                        <div className="text-xl">{discount2.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">Tax </div>
                        <div className="text-xl">{totalTax.toFixed(2)}</div>
                    </div>
                    <hr className="my-1 border-dotted" />
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-bold">Net Total </div>
                        <div className="text-xl font-bold">{((totalAmount - totalDiscount - discount2) + totalTax).toFixed(2)}</div>
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
                        <Label htmlFor="discount2">Discount</Label>
                        <Input type="number" id="discount2" name="discount2" onChange={(e) => {
                            setDiscount2(Number(e.target.value));
                        }} />
                    </div>
                    <div>
                        <Label htmlFor="cashamount">Cash Amount</Label>
                        <Input type="number" id="cashamount" name="cashamount" onChange={(e) => {
                            setCashAmount(Number(e.target.value));
                            setChangeAmount(Number(e.target.value) - (totalAmount - totalDiscount - discount2 + totalTax));
                        }} />
                    </div>
                    <div>
                        <Label htmlFor="change">Change</Label>
                        <Input type="number" name="change" readOnly value={changeAmount} />
                    </div>
                    <div>
                        <button className="bg-secondary w-full text-white px-4 py-2 rounded-md mt-4" onClick={handleSale}>Sale</button>
                    </div>
                </div>
            </div>
            <SearchProductModal isOpen={searchOpen} onClose={(e) => {
                setSearchOpen(false);
                if (e) {
                    addToCard(e);
                }
            }} />

            <SearchPartyModal isOpen={partySearchOpen} onClose={(e) => {
                setPartySearchOpen(false);
                if (e) {
                    setSelectedParty(e);
                }
            }} />

            <CartItemEditModal isOpen={cartItemEditOpen} onClose={closeEditModal} initialData={selectedItem} />
        </>
    )
}