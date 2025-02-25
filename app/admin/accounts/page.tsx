"use client"
import { useEffect, useState } from "react"
import { paymentTypes } from "@/lib/database";
import { PaymentType } from "@prisma/client";
import { FilePenLine, Plus } from "lucide-react";
import PaymentTypeModal from "@/components/dialogs/paymenttype";

export default function CategororyPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<PaymentType | null>(null);
    const [typeList, setTypeList] = useState<PaymentType[]>([]);


    async function getPaymentTypes() {
        const p = await paymentTypes();
        setTypeList(p);
    }
    useEffect(() => {
        getPaymentTypes();
    }, []);

    const handleOpenModal = (item: PaymentType | null = null) => {
        setSelectedType(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        getPaymentTypes();
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
                        <th className="w-1/4 text-left">Account #</th>
                        <th className="w-1/4 text-left">Balance</th>
                        <th className="w-1/4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {typeList.map((type: any) => (
                        <tr key={type.id}>
                            <td className="p-2">{type.name}</td>
                            <td>{type.accountNo}</td>
                            <td>{(type.Transaction[0]?.balance ?? 0)}</td>
                            <td className="text-center p-2">
                                <button onClick={() => handleOpenModal(type)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <PaymentTypeModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedType}
            />
        </>
    )
}