"use client"
import { useEffect, useState } from "react"
import { Expense } from "@prisma/client";
import { FilePenLine, Plus } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { formatDate } from "@/lib/funtions";
import ExpenseModal from "@/components/dialogs/Expense";

export default function PaymentsPage() {

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));


    useEffect(() => {
        async function getExpenses() {
            const p = await fetch('/api/expenses?page=' + page + '&s=' + search);
            const data = await p.json();
            setExpenses(data.rows);
            setTotalPages(data.meta.totalPages);
        }
        getExpenses();
    }, [page, search]);

    const handleOpenModal = (item: Expense | null = null) => {
        setSelectedExpense(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setPage(1);
        setModalOpen(false);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="uppercase font-semibold">Expenses</h1>
                    <input type="text" onChange={(e) => setSearch(e.target.value)} className="bg-gray-100 px-4 py-1" placeholder="Search payment" />
                </div>
                <button
                    className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => handleOpenModal()}
                ><Plus className="h-5 w-5" /> Add Expense
                </button>
            </div>
            <table className="table-fixed w-full mt-4 border-collapse">
                <thead className="bg-gray-100 text-sm">
                    <tr>
                        <td className="w-1/4 text-left p-2">Mode</td>
                        <td className="w-1/4 text-left p-2">Description</td>
                        <td className="w-1/4 text-left p-2">Amount</td>
                        <td className="w-1/4 text-left">Date Time</td>
                        <td className="w-1/4 text-center">Action</td>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm bg-white">
                    {expenses.map((expense: any) => (
                        <tr key={expense.id}>
                            <td className="p-2">{expense.paymentType.name}</td>
                            <td className="p-2">{expense.note}</td>
                            <td className="p-2">{expense.amount}</td>
                            <td>{formatDate(expense.expenseDate)}</td>
                            <td className="text-center">
                                <button onClick={() => handleOpenModal(expense)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <Pagination page={page} onPage={(p) => setPage(p)} totalPages={totalPages} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} />
            <ExpenseModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedExpense}
            />

        </>
    )
}