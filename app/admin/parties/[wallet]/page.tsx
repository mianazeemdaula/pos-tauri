"use client";
import Pagination from '@/components/ui/pagination';
import { formatDate } from '@/lib/funtions';
import { Plus } from 'lucide-react';
import { useEffect, useState } from "react";

export default function Transaction({ params }: { params: Promise<{ wallet: string }> }) {

    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    const fetchTransactions = async () => {
        const { wallet } = await params;
        const res = await fetch(`/api/parties/transaction/${wallet}?page=${page}&pageSize=15&s=${search}`);
        const data = await res.json();
        setTransactions(data.rows);
        setTotalPages(data.meta.totalPages);
    }

    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));


    useEffect(() => {
        fetchTransactions();
    }, [page, search]);

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1>Ledger</h1>
            </div>
            <div className='flex justify-start items-center space-x-4'>
                <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder='Search' className='px-3 py-1' />
                <input type="date" className='px-3 py-1' />
                <input type="date" className='px-3 py-1' />
            </div>
            <table className='table-fixed w-full mt-4 border-collapse'>
                <thead className='bg-gray-100 text-xs'>
                    <tr>
                        <th className='w-1/4 text-left p-2'>Type</th>
                        <th className='w-1/4 text-left'>Description</th>
                        <th className='w-1/4 text-left p-2'>Debit</th>
                        <th className='w-1/4 text-left p-2'>Credit</th>
                        <th className='w-1/4 text-left p-2'>Balance</th>
                        <th className='w-1/4 text-left '>Date</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 text-xs bg-white'>
                    {transactions.map((t: any) => (
                        <tr key={t.id}>
                            <td className='p-2'>{t.type}</td>
                            <td>{t.reference}</td>
                            <td>{t.debit.toFixed(2)}</td>
                            <td>{t.credit.toFixed(2)}</td>
                            <td className='p-2'>{t.balance.toFixed(2)}</td>
                            <td>{formatDate(t.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} onPage={setPage} />

        </div >
    );
}