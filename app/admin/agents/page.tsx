"use client"
import { useEffect, useState } from "react"
import { SaleAgent } from "@prisma/client";
import { FilePenLine, Plus, Wallet } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/ui/pagination";
import SaleAgentModal from "@/components/dialogs/sale_agent";

export default function PartiesPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedParty, setSelectedParty] = useState<SaleAgent | null>(null);
    const [search, setSearch] = useState("");
    const [partiesList, setPartiesList] = useState<SaleAgent[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));


    async function getCustomers() {
        const p = await fetch('/api/agents?page=' + page + '&s=' + search);
        const data = await p.json();
        setPartiesList(data.agents);
        setTotalPages(data.meta.totalPages);
    }

    useEffect(() => {
        getCustomers();
    }, [search, page]);

    const handleOpenModal = (item: SaleAgent | null = null) => {
        setSelectedParty(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        getCustomers();
        setModalOpen(false);
        setSelectedParty(null);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="uppercase font-semibold">Agents</h1>
                    <input type="text" onChange={(e) => setSearch(e.target.value)} className="bg-gray-100 px-4 py-1" placeholder="Search agent" />
                </div>
                <button
                    className="bg-gray-100 flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => handleOpenModal()}
                ><Plus className="h-5 w-5" /> Add Agent
                </button>
            </div>
            <table className="table-fixed w-full mt-4 border-collapse">
                <thead className="bg-gray-100 text-sm">
                    <tr className="">
                        <th className="w-1/4 text-left p-2">Code</th>
                        <th className="w-1/4 text-left p-2">Phone</th>
                        <th className="w-1/4 text-left">Name</th>
                        <th className="w-1/4 text-left">WhatsApp</th>
                        <th className="w-1/4 text-left">City</th>
                        <th className="w-1/4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm bg-white">
                    {partiesList.map((customer: any) => (
                        <tr key={customer.id}>
                            <td className="p-2">{customer.code}</td>
                            <td className="p-2">{customer.phone}</td>
                            <td>{customer.name}</td>
                            <td>{customer.whatsApp}</td>
                            <td>{customer.city}</td>
                            <td className="text-center flex space-x-2 items-center justify-center">
                                <button onClick={() => handleOpenModal(customer)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                                <Link href={`/admin/agents/${customer.id}`} onClick={() => { }} >
                                    <Wallet className="h-5 w-5" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <Pagination page={page} onPage={(p) => setPage(p)} totalPages={totalPages} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} />
            <SaleAgentModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedParty}
            />
        </>
    )
}