import { Size } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useEffect } from "react";

interface SizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Size | null;
}

const formSchema = z.object({
    name: z.string().min(3).max(255),
});

export default function SizeModal({ isOpen, onClose, initialData }: SizeModalProps) {

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
        } else {
            reset();
        }
        return () => {
            reset();
        }
    }, [initialData]);

    async function onSubmit(data: any) {
        try {
            const res = await fetch('/api/sizes', {
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
            toast.success(initialData ? 'Size updated' : 'Size Added');
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
                    {initialData ? "Edit brand" : "Add New brand"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Name</label>
                        <Input {...register('name')} type="text" placeholder="Enter Product Name" />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message?.toString()}</p>}
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
