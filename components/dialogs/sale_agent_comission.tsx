import { SaleAgent, SaleAgentCommission } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useEffect } from "react";

interface SaleAgentComissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: SaleAgentCommission | null;
}

const formSchema = z.object({
    saleAgentId: z.number().min(1),
    referece: z.string().min(5),
    salemamount: z.number().min(1),
    commission: z.number().min(1),
});

export default function SaleAgentModal({ isOpen, onClose, initialData }: SaleAgentComissionModalProps) {

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
            setValue('saleAgentId', initialData.saleAgentId);
            setValue('referece', initialData.referece);
            setValue('salemamount', initialData.salemamount);
            setValue('commission', initialData.commission);
        } else {
            reset();
        }
    }, [initialData]);

    async function onSubmit(data: any) {
        try {
            const res = await fetch(`/api/agents/commission`, {
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
            toast.success(initialData ? 'Agent updated' : 'Agent Added');
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
                    {initialData ? "Edit Agent" : "Add Agent"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Name</label>
                        <Input {...register('name')} type="text" placeholder="Enter Name" />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message?.toString()}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Phone</label>
                        <Input {...register('phone')} type="text" placeholder="Enter phone" />
                        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message?.toString()}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">WhatsApp</label>
                        <Input {...register('whatsApp')} type="text" placeholder="Enter whatsApp" />
                        {errors.whatsApp && <p className="text-sm text-red-500 mt-1">{errors.whatsApp.message?.toString()}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">City</label>
                        <Input {...register('city')} type="text" placeholder="Enter city" />
                        {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message?.toString()}</p>}
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
