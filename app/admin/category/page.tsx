"use client"
import { useEffect, useState } from "react"
import { categories } from "@/lib/database";
import { Category } from "@prisma/client";
import ItemModal from "@/components/dialogs/category_dialog";
import { FilePenLine, Plus } from "lucide-react";

export default function CategororyPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categoryList, setCategoryList] = useState<Category[]>([]);


    async function getCategory() {
        const p = await categories();
        setCategoryList(p);
    }
    useEffect(() => {
        getCategory();
    }, []);

    const handleOpenModal = (item: Category | null = null) => {
        setSelectedCategory(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        getCategory();
        setModalOpen(false);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="uppercase font-semibold">Categories</h1>
                <button
                    className="bg-gray-100 flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => handleOpenModal()}
                ><Plus className="h-5 w-5" /> Add Category
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
                    {categoryList.map((category) => (
                        <tr key={category.id}>
                            <td className="p-2">{category.name}</td>
                            <td>{category.slug}</td>
                            <td className="text-center p-2">
                                <button onClick={() => handleOpenModal(category)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <ItemModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedCategory}
            />
        </>
    )
}