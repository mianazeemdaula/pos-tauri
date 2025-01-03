"use client"
import { useEffect, useState } from "react"
import { customers, products } from "@/lib/database";
import { Customer, Product } from "@prisma/client";
import { Delete, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import Label from "@/components/ui/label";

interface SaleItem {
    id: string;
    sku: string;
    name: string;
    qty: number;
    price: number;
    discount: number;
    discountPercent: number;
    total: number;
}

export default function SalePage() {

    const [customersList, setCustomerList] = useState<Customer[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [customerBalance, setCustomerBalance] = useState(0);
    const [itemList, setItemList] = useState<SaleItem[]>([])

    const totalAmount = itemList.reduce((sum, item) => sum + item.total, 0);
    const totalQty = itemList.reduce((sum, item) => sum + item.qty, 0);
    const totalDiscount = itemList.reduce((sum, item) => sum + item.discount, 0);


    useEffect(() => {
        async function getCustomers() {
            const p = await customers();
            setCustomerList(p);
            setSelectedCustomerId(p[0].id);
            setCustomerBalance(p[0].wallet?.balance || 0);
        }
        getCustomers();
    }, [])


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
                    qty: totalQty,
                    customer_id: selectedCustomerId,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            toast.success('Sale completed');
            window.location.reload();
        } catch (error) {
            toast.error('Error: ' + (error as Error).message);
        }
    }


    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1>Sales</h1>
                <button
                    className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => { }}
                ><Plus className="h-5 w-5" /> New Sale
                </button>
            </div>


            <div className="flex items-center justify-between space-x-4 my-2">
                <div>
                    <Label htmlFor="customer_id">Customer</Label>
                    <select className="px-3 py-2 w-48" name="customer_id" onChange={(e) => {
                        setSelectedCustomerId(e.target.value);
                        const customer: any = customersList.find((c) => c.id == e.target.value);
                        if (customer) {
                            setCustomerBalance(customer?.wallet?.balance || 0);
                        }
                    }}>
                        {customersList.map((c) => (
                            <option key={c.id} value={c.id}> {c.name} </option>
                        ))}
                    </select>
                </div>
                <div className="w-48 text-right">
                    <Label htmlFor="customer_balance">Balance</Label>
                    <div><span className="font-bold">RS.</span> {customerBalance}</div>
                </div>
            </div>

            <div className="flex items-center justify-between space-x-4">
                <input type="text" name="" id="" className="w-full px-3 py-2 rounded-md" onKeyDown={skuScanSubmit} />
                <button
                    className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => { }}
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
                        {itemList.map((sale) => (
                            <tr key={sale.id}>
                                <td className="p-2">{sale.sku}</td>
                                <td className="p-2">{sale.name}</td>
                                <td className="p-2">{sale.price}</td>
                                <td>{sale.qty}</td>
                                <td>{sale.discount} ({sale.discountPercent}%)</td>
                                <td>{sale.total}</td>
                                <td className="text-center">
                                    <button onClick={() => { }} >
                                        <Delete className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table >
                <div className="bg-white w-64 p-4">
                    <div>
                        <div className="text-sm">Total </div>
                        <div className="text-xl">{totalAmount}</div>
                    </div>
                    <div>
                        <div className="text-sm">Discount </div>
                        <div className="text-xl">{totalDiscount}</div>
                    </div>
                    <div>
                        <div className="text-sm">Qty </div>
                        <div className="text-xl">{totalQty}</div>
                    </div>
                    <div>
                        <div className="text-sm">Items Count </div>
                        <div className="text-xl">{itemList.length}</div>
                    </div>
                    <div>
                        <button className="bg-secondary text-white px-4 py-2 rounded-md mt-4" onClick={handleSale}>Sale</button>
                    </div>
                </div>
            </div>
        </>
    )
}