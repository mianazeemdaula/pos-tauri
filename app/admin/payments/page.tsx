"use client"
import { useEffect, useState } from "react"
import { SellerWalletTransaction } from "@prisma/client";
import { FilePenLine, Plus } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { formatDate } from "@/lib/funtions";
import PaymentModal from "@/components/dialogs/payment";

export default function PaymentsPage() {

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<SellerWalletTransaction | null>(null);
    const [payments, setPayments] = useState<SellerWalletTransaction[]>([]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));


    useEffect(() => {
        async function getPayments() {
            const p = await fetch('/api/payments?page=' + page + '&s=' + search);
            const data = await p.json();
            setPayments(data.rows);
            setTotalPages(data.meta.totalPages);
        }
        getPayments();
    }, [page, search]);

    const handleOpenModal = (item: SellerWalletTransaction | null = null) => {
        setSelectedPayment(item);
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
                    <h1 className="uppercase font-semibold">Payments</h1>
                    <input type="text" onChange={(e) => setSearch(e.target.value)} className="bg-gray-100 px-4 py-1" placeholder="Search payment" />
                </div>
                <button
                    className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => handleOpenModal()}
                ><Plus className="h-5 w-5" /> Add Payment
                </button>
            </div>
            <table className="table-fixed w-full mt-4 border-collapse">
                <thead className="bg-gray-100 text-sm">
                    <tr>
                        <td className="w-1/4 text-left p-2">Seller</td>
                        <td className="w-1/4 text-left p-2">Description</td>
                        <td className="w-1/4 text-left p-2">Amount</td>
                        <td className="w-1/4 text-left">Date Time</td>
                        <td className="w-1/4 text-center">Action</td>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm bg-white">
                    {payments.map((payment: any) => (
                        <tr key={payment.id}>
                            <td className="p-2">{payment.wallet.seller.name}</td>
                            <td className="p-2">{payment.description}</td>
                            <td className="p-2">{payment.amount}</td>
                            <td>{formatDate(payment.createdAt)}</td>
                            <td className="text-center">
                                <button onClick={() => handleOpenModal(payment)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <Pagination page={page} onPage={(p) => setPage(p)} totalPages={totalPages} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} />
            <PaymentModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedPayment}
            />

        </>
    )
}