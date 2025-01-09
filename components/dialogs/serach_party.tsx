import { Party } from "@prisma/client";
import { CheckSquare, CircleX } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchModalProps {
    isOpen: boolean;
    onClose: (product: Party | null) => void;
}
export default function SearchPartyModal({ isOpen, onClose }: SearchModalProps) {
    const [search, setSearch] = useState("");
    const [partiesList, setPartiesList] = useState<Party[]>([]);

    useEffect(() => {
        async function serachProducts() {
            const res = await fetch(`/api/parties?s=${search}`)
            const data = await res.json();
            setPartiesList(data.parties);
        }
        serachProducts();
    }, [search]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-8/12">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg mb-2">
                        Search Party
                    </h2>
                    <button onClick={() => onClose(null)} className=""><CircleX /></button>
                </div>
                <div>
                    <input className="px-4 py-1 w-full bg-gray-50" type="text" onChange={(e) => setSearch(e.target.value)} id="" placeholder="Serach Party" />
                </div>
                <table className="table-fixed w-full border-collapse text-xs mt-4">
                    <thead className="bg-gray-100 text-sm">
                        <tr>
                            <td className="w-1/4 text-left p-2">SKU</td>
                            <td className="w-1/4 text-left">Name</td>
                            <td className="w-1/4 text-left" >Phone</td>
                            <td className="w-1/4 text-left">WhatsApp</td>
                            <td className="w-1/4 text-left">City</td>
                            <td className="w-1/4 text-center">Action</td>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm bg-white">
                        {partiesList.map((p) => (
                            <tr key={p.id}>
                                <td className="p-2">{p.id}</td>
                                <td>{p.name}</td>
                                <td>{p.phone}</td>
                                <td>{p.whatsApp}</td>
                                <td>{p.city}</td>
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
