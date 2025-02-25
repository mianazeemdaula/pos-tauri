"use client"
import { useEffect, useState } from "react"
import { Product } from "@prisma/client";
import ProductModal from "@/components/dialogs/product";
import { FilePenLine, Plus } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { formatDate } from "@/lib/funtions";

export default function Products() {

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productList, setProductList] = useState<Product[]>([]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));


    useEffect(() => {
        async function getProducts() {
            const p = await fetch('/api/product?page=' + page + '&s=' + search);
            const data = await p.json();
            setProductList(data.rows);
            setTotalPages(data.meta.totalPages);
        }
        getProducts();
    }, [page, search]);

    const handleOpenModal = (item: Product | null = null) => {
        setSelectedProduct(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        window.location.reload();
        setModalOpen(false);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="uppercase font-semibold">Products</h1>
                    <input type="text" onChange={(e) => setSearch(e.target.value)} className="bg-gray-100 px-4 py-1" placeholder="Search product" />
                </div>
                <button
                    className="flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => handleOpenModal()}
                ><Plus className="h-5 w-5" /> Add Product
                </button>
            </div>
            <table className="table-fixed w-full mt-4 border-collapse">
                <thead className="bg-gray-100 text-xs">
                    <tr>
                        <td className="w-1/4 text-left p-2">SKU</td>
                        <td className="w-1/4 text-left p-2">Name</td>
                        <td className="w-1/4 text-left">Size</td>
                        <td className="w-1/4 text-left">Price</td>
                        <td className="w-1/4 text-left">Discount</td>
                        <td className="w-1/4 text-left">Sale Price</td>
                        <td className="w-1/4 text-left">Stock</td>
                        <td className="w-1/4 text-left">Created At</td>
                        <td className="w-1/4 text-center">Action</td>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm bg-white">
                    {productList.map((product: any) => (
                        <tr key={product.id}>
                            <td className="p-2">{product.code}</td>
                            <td className="p-2">{product.name}</td>
                            <td className="p-2">{product.size.name}</td>
                            <td>{product.price}</td>
                            <td>{product.discount}%</td>
                            <td>{product.price - (product.price * product.discount / 100)}</td>
                            <td>{product.stock}</td>
                            <td className="text-nowrap">{formatDate(product.createdAt)}</td>
                            <td className="text-center">
                                <button onClick={() => handleOpenModal(product)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <Pagination page={page} onPage={(p) => setPage(p)} totalPages={totalPages} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage} />
            <ProductModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedProduct}
            />

        </>
    )
}