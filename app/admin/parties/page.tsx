"use client"
import { useEffect, useState } from "react"
import { Party } from "@prisma/client";
import CustomerModal from "@/components/dialogs/party";
import { FilePenLine, Plus, Wallet } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/ui/pagination";

export default function PartiesPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedParty, setSelectedParty] = useState<Party | null>(null);
    const [search, setSearch] = useState("");
    const [partiesList, setPartiesList] = useState<Party[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

    useEffect(() => {
        async function getCustomers() {
            const p = await fetch('/api/parties?page=' + page + '&s=' + search);
            const data = await p.json();
            setPartiesList(data.parties);
            setTotalPages(data.meta.totalPages);
        }
        getCustomers();
    }, [search, page]);

    const handleOpenModal = (item: Party | null = null) => {
        setSelectedParty(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedParty(null);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="uppercase font-semibold">Customers</h1>
                    <input type="text" onChange={(e) => setSearch(e.target.value)} className="bg-gray-100 px-4 py-1" placeholder="Search customer" />
                </div>
                <button
                    className="bg-gray-100 flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => handleOpenModal()}
                ><Plus className="h-5 w-5" /> Add Customer
                </button>
            </div>
            <table className="table-fixed w-full mt-4 border-collapse">
                <thead className="bg-gray-100 text-sm">
                    <tr className="">
                        <th className="w-1/4 text-left p-2">Phone</th>
                        <th className="w-1/4 text-left">Name</th>
                        <th className="w-1/4 text-left">City</th>
                        <th className="w-1/4 text-left">Address</th>
                        <th className="w-1/4 text-left">Balance</th>
                        <th className="w-1/4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm bg-white">
                    {partiesList.map((customer: any) => (
                        <tr key={customer.id}>
                            <td className="p-2">{customer.phone}</td>
                            <td>{customer.name}</td>
                            <td>{customer.city}</td>
                            <td>{customer.address}</td>
                            <td>RS. {(customer.ledgers[0]?.balance ?? 0).toFixed(2)}</td>
                            <td className="text-center flex space-x-2 items-center justify-center">
                                <button onClick={() => handleOpenModal(customer)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                                <Link href={`/admin/parties/${customer.id}`} onClick={() => { }} >
                                    <Wallet className="h-5 w-5" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <Pagination page={page} onPage={(p) => setPage(p)} totalPages={totalPages} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} />
            <CustomerModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedParty}
            />
        </>
    )
}