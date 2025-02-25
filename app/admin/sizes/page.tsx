"use client"
import { useEffect, useState } from "react"
import { brands, sizes } from "@/lib/database";
import { Size } from "@prisma/client";
import { FilePenLine, Plus } from "lucide-react";
import BrandModal from "@/components/dialogs/brand";
import SizeModal from "@/components/dialogs/size";

export default function CategororyPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [sizesList, setSizesList] = useState<Size[]>([]);


    async function getSizes() {
        const p = await sizes();
        setSizesList(p);
    }
    useEffect(() => {
        getSizes();
    }, []);

    const handleOpenModal = (item: Size | null = null) => {
        setSelectedSize(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        getSizes();
        setModalOpen(false);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="uppercase font-semibold">Sizes</h1>
                <button
                    className="bg-gray-100 flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => handleOpenModal()}
                ><Plus className="h-5 w-5" /> Add Size
                </button>
            </div>
            <table className="table-fixed w-full mt-4 border-collapse text-sm">
                <thead className="bg-gray-100">
                    <tr className="">
                        <th className="w-1/4 text-left p-2">Name</th>
                        <th className="w-1/4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {sizesList.map((size) => (
                        <tr key={size.id}>
                            <td className="p-2">{size.name}</td>
                            <td className="text-center p-2">
                                <button onClick={() => handleOpenModal(size)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <SizeModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedSize}
            />
        </>
    )
}