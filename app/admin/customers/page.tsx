"use client"
import { useEffect, useState } from "react"
import { customers } from "@/lib/database";
import { Customer } from "@prisma/client";
import CustomerModal from "@/components/dialogs/customer";
import { FilePenLine, Plus, Wallet } from "lucide-react";
import Link from "next/link";

export default function CategororyPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerList, setCustomerList] = useState<Customer[]>([]);


    async function getCustomers() {
        const p = await customers();
        setCustomerList(p);
    }
    useEffect(() => {
        getCustomers();
    }, []);

    const handleOpenModal = (item: Customer | null = null) => {
        setSelectedCustomer(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        getCustomers();
        setModalOpen(false);
        setSelectedCustomer(null);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <h1>Customers</h1>
                <button
                    className="bg-gray-100 flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md hover:bg-secondary transition-colors hover:text-white"
                    onClick={() => handleOpenModal()}
                ><Plus className="h-5 w-5" /> Add Customer
                </button>
            </div>
            <table className="table-fixed w-full mt-4 border-collapse">
                <thead className="bg-gray-100 text-sm">
                    <tr className="">
                        <th className="w-1/4 text-left p-2">Phone</th>
                        <th className="w-1/4 text-left">Name</th>
                        <th className="w-1/4 text-left">City</th>
                        <th className="w-1/4 text-left">Address</th>
                        <th className="w-1/4 text-left">Wallet</th>
                        <th className="w-1/4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm bg-white">
                    {customerList.map((customer: any) => (
                        <tr key={customer.id}>
                            <td className="p-2">{customer.phone}</td>
                            <td>{customer.name}</td>
                            <td>{customer.city}</td>
                            <td>{customer.address}</td>
                            <td>RS. {customer.wallet ? customer.wallet.balance : 0}</td>
                            <td className="text-center flex space-x-2 items-center justify-center">
                                <button onClick={() => handleOpenModal(customer)} >
                                    <FilePenLine className="h-5 w-5" />
                                </button>
                                <Link href={`/admin/customers/${customer.id}`} onClick={() => { }} >
                                    <Wallet className="h-5 w-5" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >
            <CustomerModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                initialData={selectedCustomer}
            />
        </>
    )
}