import { PaymentType } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useEffect } from "react";

interface PaymentTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: PaymentType | null;
}

const formSchema = z.object({
    name: z.string().min(3).max(255),
    accountNo: z.string(),
});

export default function PaymentTypeModal({ isOpen, onClose, initialData }: PaymentTypeModalProps) {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (initialData) {
            setValue('name', initialData.name);
            setValue('accountNo', initialData.accountNo);
        } else {
            reset();
        }
        return () => {
            reset();
        }
    }, [initialData]);

    async function onSubmit(data: any) {
        try {
            const res = await fetch('/api/paymenttypes', {
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
            toast.success(initialData ? 'Account updated' : 'Account Added');
            onClose();
        } catch (error) {
            toast.error('Error: ' + (error as Error).message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Account" : "Add New Account"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Name</label>
                        <Input {...register('name')} type="text" placeholder="Enter Account Name" />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message?.toString()}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Account #</label>
                        <Input {...register('accountNo')} type="text" placeholder="Enter Account #" />
                        {errors.accountNo && <p className="text-sm text-red-500 mt-1">{errors.accountNo.message?.toString()}</p>}
                    </div>
                    <div className="flex justify-end">
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
