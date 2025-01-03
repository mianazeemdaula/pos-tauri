import { Customer, CustomerWalletTransaction, Seller } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { customers } from "@/lib/database";
import Select from "../ui/select";
import Label from "../ui/label";

interface ReceivingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: CustomerWalletTransaction | null;
}

const formSchema = z.object({
    customerId: z.string().min(1),
    amount: z.number().min(1),
    description: z.string().min(3).max(100),
});

export default function ReceivingModal({ isOpen, onClose, initialData }: ReceivingModalProps) {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const [customersList, setCustomersList] = useState<Customer[]>([]);


    async function getCustomers() {
        const res = await customers();
        setCustomersList(res);
    }

    useEffect(() => {
        if (initialData) {
        } else {
            reset();
        }
        getCustomers();
    }, [initialData]);

    async function onSubmit(data: any) {
        console.log(data);
        try {
            const res = await fetch('/api/receivings', {
                method: initialData ? 'PUT' : 'POST',
                body: JSON.stringify({
                    ...data,
                    ...(initialData && { id: initialData.id })
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            toast.success(initialData ? 'Receiving updated' : 'Receiving Added');
            onClose();
        } catch (error) {
            toast.error('Error: ' + (error as Error).message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-4/12">
                <h2 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Payment" : "Add Payment"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <div className="">
                        <Label htmlFor="customerId">Seller</Label>
                        <Select options={[]} {...register('customerId')}>
                            {customersList.map((customer) => (
                                <option key={customer.id} value={customer.id} >{customer.name}</option>
                            ))}
                        </Select>
                        {errors.customerId && <p className="text-sm text-red-500 mt-1">{errors.customerId.message?.toString()}</p>}
                    </div>
                    <div className="">
                        <Label htmlFor="description">Description</Label>
                        <Input {...register('description')} type="text" placeholder="Enter note" />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message?.toString()}</p>}
                    </div>
                    <div className="">
                        <Label htmlFor="amount">Amount</Label>
                        <Input {...register('amount', { valueAsNumber: true })} type="number" placeholder="Enter amount" />
                        {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message?.toString()}</p>}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-400 text-white px-4 py-2 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
