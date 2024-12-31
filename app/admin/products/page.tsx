"use client"
import { useEffect, useState } from "react"
import { products } from "@/lib/database";
import { Product } from "@prisma/client";
import ProductModal from "@/components/dialogs/product";
import { FilePenLine, Plus } from "lucide-react";

export default function Products() {

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productList, setProductList] = useState<Product[]>([]);

    async function getProducts() {
        const p = await products();
        setProductList(p);
    }
    useEffect(() => {
        getProducts();
    }, [])

    const handleOpenModal = (item: Product | null = null) => {
        setSelectedProduct(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        getProducts();
        setModalOpen(false);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <h1>Products</h1>
                <button
                    className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => handleOpenModal()}
                ><Plus className="h-5 w-5" /> Add Product
                </button>
            </div>
            <table className="table-fixed w-full mt-4 border-collapse">
                <thead className="bg-gray-100 text-sm">
                    <tr>
                        <td className="w-1/4 text-left p-2">SKU</td>
                        <td className="w-1/4 text-left p-2">Name</td>
                        <td className="w-1/4 text-left">Price</td>
                        <td className="w-1/4 text-left">Discount</td>
                        <td className="w-1/4 text-left">Sale Price</td>
                        <td className="w-1/4 text-left">Created At</td>
                        <td className="w-1/4 text-center">Action</td>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm bg-white">
                    {productList.map((product) => (
                        <tr key={product.id}>
                            <td className="p-2">{product.code}</td>
                            <td className="p-2">{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.discount}%</td>
                            <td>{product.price - (product.price * product.discount / 100)}</td>
                            <td>{product.createdAt.toDateString()}</td>
                            <td className="text-center">
                                <button onClick={() => handleOpenModal(product)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <ProductModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedProduct}
            />

        </>
    )
}