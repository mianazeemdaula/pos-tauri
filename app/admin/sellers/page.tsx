"use client"
import { useEffect, useState } from "react"
import { sellers } from "@/lib/database";
import { Seller } from "@prisma/client";
import { FilePenLine, Plus } from "lucide-react";
import SellerModal from "@/components/dialogs/seller";

export default function SellerPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
    const [sellerList, setSellerList] = useState<Seller[]>([]);


    async function getSellers() {
        const p = await sellers();
        setSellerList(p);
    }
    useEffect(() => {
        getSellers();
    }, []);

    const handleOpenModal = (item: Seller | null = null) => {
        setSelectedSeller(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        getSellers();
        setModalOpen(false);
        setSelectedSeller(null);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <h1>Sellers</h1>
                <button
                    className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => handleOpenModal()}
                ><Plus className="h-5 w-5" /> Add Seller
                </button>
            </div>
            <table className="table-fixed w-full mt-4 border-collapse">
                <thead className="bg-gray-50">
                    <tr className="">
                        <th className="w-1/4 text-left">Phone</th>
                        <th className="w-1/4 text-left">Name</th>
                        <th className="w-1/4 text-left">City</th>
                        <th className="w-1/4 text-left">Address</th>
                        <th className="w-1/4 text-left">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                    {sellerList.map((seller) => (
                        <tr key={seller.id}>
                            <td>{seller.phone}</td>
                            <td>{seller.name}</td>
                            <td>{seller.city}</td>
                            <td>{seller.address}</td>
                            <td>
                                <button onClick={() => handleOpenModal(seller)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <SellerModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedSeller}
            />
        </>
    )
}