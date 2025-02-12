import { Expense, PaymentType } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { parties, paymentTypes } from "@/lib/database";
import Select from "../ui/select";
import Label from "../ui/label";

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Expense | null;
}

const formSchema = z.object({
    amount: z.number().min(1),
    paymentTypeId: z.number().min(1),
    note: z.string().min(3).max(100),
    expenseDate: z.date(),
});

export default function ExpenseModal({ isOpen, onClose, initialData }: ExpenseModalProps) {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const [paymentTypesList, setPaymentTypesList] = useState<PaymentType[]>([]);

    useEffect(() => {
        async function getPaymentTypes() {
            const res = await paymentTypes();
            setPaymentTypesList(res);
        }
        if (initialData) {
        } else {
            reset();
        }
        getPaymentTypes();
    }, [initialData]);

    async function onSubmit(data: any) {
        console.log(data);
        try {
            const res = await fetch('/api/expenses', {
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
            toast.success(initialData ? 'Expense updated' : 'Expense Added');
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
                        <Label htmlFor="paymentTypeId">Payment Type</Label>
                        <Select options={[]} {...register('paymentTypeId', { valueAsNumber: true })}>
                            {paymentTypesList.map((type) => (
                                <option key={type.id} value={type.id} >{type.name}</option>
                            ))}
                        </Select>
                        {errors.paymentTypeId && <p className="text-sm text-red-500 mt-1">{errors.paymentTypeId.message?.toString()}</p>}
                    </div>
                    <div className="">
                        <Label htmlFor="note">Description</Label>
                        <Input {...register('note')} type="text" placeholder="Enter note" />
                        {errors.note && <p className="text-sm text-red-500 mt-1">{errors.note.message?.toString()}</p>}
                    </div>
                    <div className="">
                        <Label htmlFor="amount">Amount</Label>
                        <Input {...register('amount', { valueAsNumber: true })} type="number" placeholder="Enter amount" />
                        {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message?.toString()}</p>}
                    </div>
                    <div className="">
                        <Label htmlFor="expenseDate">Date</Label>
                        <Input {...register('expenseDate', { valueAsDate: true })} type="date" placeholder="Enter Date" />
                        {errors.expenseDate && <p className="text-sm text-red-500 mt-1">{errors.expenseDate.message?.toString()}</p>}
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
