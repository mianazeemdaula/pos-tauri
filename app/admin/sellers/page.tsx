"use client"
import { useEffect, useState } from "react"
import { Seller } from "@prisma/client";
import { FilePenLine, Plus } from "lucide-react";
import SellerModal from "@/components/dialogs/seller";
import Pagination from "@/components/ui/pagination";

export default function SellerPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
    const [sellerList, setSellerList] = useState<Seller[]>([]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));


    useEffect(() => {
        async function getSellers() {
            const p = await fetch('/api/seller?page=' + page + '&s=' + search);
            const data = await p.json();
            setSellerList(data.rows);
            setTotalPages(data.meta.totalPages);
        }
        getSellers();
    }, [page, search]);

    const handleOpenModal = (item: Seller | null = null) => {
        setSelectedSeller(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedSeller(null);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="uppercase font-semibold">Sellers</h1>
                    <input type="text" onChange={(e) => setSearch(e.target.value)} className="bg-gray-100 px-4 py-1" placeholder="Search seller" />
                </div>
                <button
                    className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => handleOpenModal()}
                ><Plus className="h-5 w-5" /> Add Seller
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
                        <th className="w-1/4 text-left">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm bg-white">
                    {sellerList.map((seller: any) => (
                        <tr key={seller.id}>
                            <td className="p-2">{seller.phone}</td>
                            <td>{seller.name}</td>
                            <td>{seller.city}</td>
                            <td>{seller.address}</td>
                            <td>RS {seller.wallet?.balance ?? 0}</td>
                            <td>
                                <button onClick={() => handleOpenModal(seller)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <Pagination page={page} onPage={(p) => setPage(p)} totalPages={totalPages} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} />

            <SellerModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedSeller}
            />
        </>
    )
}