import { Product } from "@prisma/client";
import { CheckSquare, CircleX } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchModalProps {
    isOpen: boolean;
    onClose: (product: Product | null) => void;
}

export default function SearchProductModal({ isOpen, onClose }: SearchModalProps) {



    const [search, setSearch] = useState("");
    const [productsList, setProductsList] = useState<Product[]>([]);

    useEffect(() => {
        async function serachProducts() {
            const res = await fetch(`/api/product/search?s=${search}`)
            const data = await res.json();
            setProductsList(data);
        }
        serachProducts();
    }, [search]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-8/12">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg mb-2">
                        Search Product
                    </h2>
                    <button onClick={() => onClose(null)} className=""><CircleX /></button>
                </div>
                <div>
                    <input className="px-4 py-1 w-full bg-gray-50" type="text" onChange={(e) => setSearch(e.target.value)} id="" placeholder="Serach Product" />
                </div>
                <table className="table-fixed w-full border-collapse text-xs mt-4">
                    <thead className="bg-gray-100 text-sm">
                        <tr>
                            <td className="w-1/4 text-left p-2">SKU</td>
                            <td className="w-1/4 text-left">Name</td>
                            <td className="w-1/4 text-left">Brand</td>
                            <td className="w-1/4 text-left" >Stock</td>
                            <td className="w-1/4 text-left">Price</td>
                            <td className="w-1/4 text-left">Discount</td>
                            <td className="w-1/4 text-center">Action</td>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm bg-white">
                        {productsList.map((p: any) => (
                            <tr key={p.id}>
                                <td className="p-2">{p.code}</td>
                                <td>{p.name} ({p.size.name})</td>
                                <td>{p.brand.name}</td>
                                <td>{p.stock}</td>
                                <td>{p.price}</td>
                                <td>{p.discount}%</td>
                                <td className="text-center">
                                    <button onClick={() => onClose(p)}>
                                        <CheckSquare className="size-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
