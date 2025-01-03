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
        const res = await fetch(`/api/customer/transaction/${wallet}?page=${page}&pageSize=15&s=${search}`);
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
                <h1>Customers</h1>
                <button
                    className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => { }}
                ><Plus className="h-5 w-5" /> Add Customer
                </button>
            </div>
            <div className='flex justify-between items-center mt-4'>
                {/* Implement search for the transactions and data filters */}
                <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder='Search' className='px-3 py-1' />
                <select className='p-2 border border-gray-200 rounded-md'>
                    <option value=''>All</option>
                    <option value='credit'>Credit</option>
                    <option value='debit'>Debit</option>
                    <option value='transfer'>Transfer</option>
                </select>
                <input type="date" className='p-2 border border-gray-200 rounded-md' />
                <input type="date" className='p-2 border border-gray-200 rounded-md' />
            </div>
            <table className='table-fixed w-full mt-4 border-collapse'>
                <thead className='bg-gray-100 text-sm'>
                    <tr>
                        <th className='w-1/4 text-left p-2'>Type</th>
                        <th className='w-1/4 text-left'>Description</th>
                        <th className='w-1/4 text-left p-2'>Amount</th>
                        <th className='w-1/4 text-left '>Date</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 text-sm bg-white'>
                    {transactions.map((t: any) => (
                        <tr key={t.id}>
                            <td className='p-2'>{t.type}</td>
                            <td>{t.description}</td>
                            <td className='p-2'>RS {t.amount}</td>
                            <td>{formatDate(t.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} onPage={setPage} />

        </div>
    );
}