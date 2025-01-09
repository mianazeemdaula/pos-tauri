import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useEffect } from "react";
import Label from "../ui/label";
import { SaleItem } from "@/lib/datatypes";

interface CartItemEditModalProps {
    isOpen: boolean;
    onClose: (item: any | null) => void;
    initialData: SaleItem | null;
}

const formSchema = z.object({
    price: z.number().min(1),
    discount: z.number().min(0),
    qty: z.number().min(1),
});

export default function CartItemEditModal({ isOpen, onClose, initialData }: CartItemEditModalProps) {

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
            setValue('price', initialData.price);
            setValue('discount', initialData.discountPercent);
            setValue('qty', initialData.qty);
        } else {
            reset();
        }
    }, [initialData]);

    async function onSubmit(data: any) {
        data.id = initialData?.id || null;
        onClose(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-4/12">
                <h2 className="text-lg font-bold mb-4">
                    Edit Cart Item
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <div className="">
                        <Label htmlFor="price">Price</Label>
                        <Input {...register('price', { valueAsNumber: true })} type="number" placeholder="Enter price" />
                        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message?.toString()}</p>}
                    </div>
                    <div className="">
                        <Label htmlFor="qty">Qty</Label>
                        <Input {...register('qty', { valueAsNumber: true })} type="number" placeholder="Enter qty" />
                        {errors.qty && <p className="text-sm text-red-500 mt-1">{errors.qty.message?.toString()}</p>}
                    </div>
                    <div className="">
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input {...register('discount', { valueAsNumber: true })} type="number" placeholder="Enter discount" step={0.1} />
                        {errors.discount && <p className="text-sm text-red-500 mt-1">{errors.discount.message?.toString()}</p>}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={() => { onClose(null) }}
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
            </div >
        </div >
    );
}
