"use client";
import Pagination from "@/components/ui/pagination";
import { useEffect, useState } from "react";

export default function LedgerPage({ params }: { params: Promise<{ id: string }> }) {
    const [ledger, setLedger] = useState<any[]>([]);

    useEffect(() => {
        async function getLedger() {
            const id = (await params).id;
            const p = await fetch(`/api/ledger/${id}`);
            const data = await p.json();
            setLedger(data);
        }
        getLedger();
    }, []);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

    if (!ledger || !ledger.length) return <div>Loading...</div>;

    return (
        <div>

            <table className="table-fixed w-full mt-4 border-collapse">
                <thead className="bg-gray-100 text-sm">
                    <tr className="">
                        <th className="w-1/4 text-left p-2">ID</th>
                        <th className="w-1/4 text-left">Description</th>
                        <th className="w-1/4 text-left">Debit</th>
                        <th className="w-1/4 text-left">Credit</th>
                        <th className="w-1/4 text-left">Balance</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm bg-white">
                    {ledger.length > 0 && (
                        <tr className="font-bold">
                            <td className="p-2">Opening Balance</td>
                            <td colSpan={4} className="text-left">{ledger[0].openBalance}</td>
                        </tr>
                    )}
                    {ledger.map((row: any) => (
                        <tr key={row.id}>
                            <td className="p-2">{row.id}</td>
                            <td>{row.note}</td>
                            <td>{row.debit}</td>
                            <td>{row.credit}</td>
                            <td>{row.balance}</td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <Pagination page={page} onPage={(p) => setPage(p)} totalPages={totalPages} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} />
        </div>
    );

}