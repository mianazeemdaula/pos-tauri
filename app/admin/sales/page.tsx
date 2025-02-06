"use client"
import { useEffect, useState } from "react"
import { Sale } from "@prisma/client";
import { Eye, FilePenLine, Plus, Undo2 } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/ui/pagination";
import { formatDate } from "@/lib/funtions";

export default function SalesPage() {

    const [salesList, setSalesList] = useState<Sale[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);



    useEffect(() => {
        async function getSales() {
            const p = await fetch(`/api/sale?page=${page}&pageSize=15`);
            const data = await p.json();
            setSalesList(data.rows);
            setTotalPages(data.meta.totalPages);
        }
        getSales();
        return () => {
            setSalesList([]);
        }
    }, [page]);

    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

    return (
        <>
            <div className="flex justify-between items-center">
                <h1>Sales</h1>
                <div className="flex gap-x-2">
                    <Link href={"/admin/sales/new"}
                        className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                    ><Plus className="h-5 w-5" /> New Sale
                    </Link>
                    <Link href={"/admin/sales/return"}
                        className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                    ><Undo2 className="h-5 w-5" /> Return Sale
                    </Link>
                </div>
            </div>
            <table className="table-fixed w-full mt-4 border-collapse">
                <thead className="bg-gray-100 text-sm">
                    <tr>
                        <td className="w-1/4 text-left p-2">Party</td>
                        <td className="w-1/4 text-left">Salesmen</td>
                        <td className="w-1/4 text-left">Total</td>
                        <td className="w-1/4 text-left">ٰItems</td>
                        <td className="w-1/4 text-left">Date Time</td>
                        <td className="w-1/4 text-center">Action</td>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm bg-white">
                    {salesList.map((sale: any) => (
                        <tr key={sale.id}>
                            <td className="p-2">{sale.party?.name ?? 'Cash'}</td>
                            <td>{sale.user.name}</td>
                            <td>RS {sale.total}</td>
                            <td>{sale._count.items}</td>
                            <td>{formatDate(sale.createdAt)}</td>
                            <td className="text-center flex justify-center gap-x-2">
                                <Link href={`/admin/sales/${sale.id}`} >
                                    <Eye className="h-5 w-5" />
                                </Link>
                                <button onClick={() => { }} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <Pagination page={page} totalPages={totalPages} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} onPage={setPage} />
        </>
    )
}