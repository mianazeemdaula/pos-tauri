"use client";

import { PrinterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function SaledViewPage(
    { params }: { params: Promise<{ id: string }> }
) {
    const [sale, setSale] = useState<any>({});

    useEffect(() => {
        async function getSale() {
            const p = await fetch(`/api/sale/find?id=${(await params).id}`);
            const data = await p.json();
            setSale(data);
        }
        getSale();
    }, []);


    const printSlip = async () => {
        try {
            const res = await fetch('http://localhost:5000/print',
                {
                    method: 'POST',
                    body: JSON.stringify(sale),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            const d = await res.json();
            if (!res.ok) {
                throw new Error(d.error);
            }
            toast.success('Slip printed successfully');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        }
    }

    if (!sale.id) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex gap-4">
                <div className="bg-white shadow-md rounded p-4 mb-4">
                    <h2 className="text-xl font-bold mb-2">Customer Details</h2>
                    {sale.party ? (
                        <>
                            <p className="text-gray-700"><span className="font-semibold">Name:</span> {sale.party.name}</p>
                            <p className="text-gray-700"><span className="font-semibold">City:</span> {sale.party.city}</p>
                            <p className="text-gray-700"><span className="font-semibold">Phone:</span> {sale.party.phone}</p>
                        </>
                    ) : (
                        <p className="text-gray-700">Cash Sale</p>
                    )}
                </div>
                <div className="bg-white shadow-md rounded p-4 mb-4">
                    <h2 className="text-xl font-bold mb-2">Salesman Details</h2>
                    <p className="text-gray-700"><span className="font-semibold">Name:</span> {sale.user.name}</p>
                    <p className="text-gray-700"><span className="font-semibold">Email:</span> {sale.user.username}</p>
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center">
                    <h2>Order Details</h2>
                    <div className="">
                        <button className="flex gap-x-2" onClick={printSlip} >
                            <PrinterIcon className="h-5 w-5" />
                            <div>Print</div>
                        </button>
                    </div>
                </div>
                <table className="table-fixed w-full mt-4 border-collapse">
                    <thead className="bg-gray-100 text-sm">
                        <tr>
                            <th className="p-2 text-left">Product</th>
                            <th className="text-left" >Quantity</th>
                            <th className="text-left" >Price</th>
                            <th className="text-left" >Discount</th>
                            <th className="text-left" >Tax</th>
                            <th className="text-left" >Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm bg-white">
                        {sale.items.map((od: any) => (
                            <tr key={od.id}>
                                <td className="p-2">{od.product.name}</td>
                                <td>{od.quantity}</td>
                                <td>{od.price}</td>
                                <td>{od.discount}</td>
                                <td>{od.tax}</td>
                                <td>{((od.price * od.quantity) + od.tax) - od.discount}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="text-sm">
                        <tr>
                            <td colSpan={5} className="text-right p-2">Total</td>
                            <td>RS {sale.total + sale.tax + sale.discount + sale.discount2}</td>
                        </tr>
                        <tr>
                            <td colSpan={5} className="text-right p-2">Discount</td>
                            <td>RS {sale.discount}</td>
                        </tr>
                        <tr>
                            <td colSpan={5} className="text-right p-2">Discount2</td>
                            <td>RS {sale.discount2}</td>
                        </tr>
                        <tr>
                            <td colSpan={5} className="text-right p-2">Tax</td>
                            <td>RS {sale.tax}</td>
                        </tr>
                        <tr>
                            <td colSpan={5} className="text-right p-2">Net Total</td>
                            <td>RS {sale.total}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}