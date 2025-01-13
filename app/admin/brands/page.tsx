"use client"
import { useEffect, useState } from "react"
import { brands } from "@/lib/database";
import { Brand } from "@prisma/client";
import { FilePenLine, Plus } from "lucide-react";
import BrandModal from "@/components/dialogs/brand";

export default function CategororyPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [brandsList, setBrandsList] = useState<Brand[]>([]);


    async function getBrands() {
        const p = await brands();
        setBrandsList(p);
    }
    useEffect(() => {
        getBrands();
    }, []);

    const handleOpenModal = (item: Brand | null = null) => {
        setSelectedBrand(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        getBrands();
        setModalOpen(false);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="uppercase font-semibold">Brands</h1>
                <button
                    className="bg-gray-100 flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => handleOpenModal()}
                ><Plus className="h-5 w-5" /> Add Brand
                </button>
            </div>
            <table className="table-fixed w-full mt-4 border-collapse text-sm">
                <thead className="bg-gray-100">
                    <tr className="">
                        <th className="w-1/4 text-left p-2">Name</th>
                        <th className="w-1/4 text-left">Slug</th>
                        <th className="w-1/4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {brandsList.map((brand) => (
                        <tr key={brand.id}>
                            <td className="p-2">{brand.name}</td>
                            <td>{brand.slug}</td>
                            <td className="text-center p-2">
                                <button onClick={() => handleOpenModal(brand)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <BrandModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedBrand}
            />
        </>
    )
}