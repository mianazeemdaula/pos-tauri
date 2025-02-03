import { Brand, Category, Product } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { brands, categories } from "@/lib/database";
import Select from "../ui/select";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Product | null;
}

const formSchema = z.object({
    categoryId: z.number().min(1),
    brandId: z.number().min(1),
    code: z.string().min(3).max(64),
    name: z.string().min(3).max(50),
    nameUr: z.string().min(3).max(60),
    price: z.number().min(1),
    discount: z.number().min(0).max(100),
    stock: z.number().min(0),
    tax: z.number().min(0).max(100),
    lowStockAlert: z.number().min(0),
});

export default function ProductModal({ isOpen, onClose, initialData }: ProductModalProps) {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [brandsList, setBrandsList] = useState<Brand[]>([]);


    async function getInitData() {
        const res = await categories();
        const res2 = await brands();
        setCategoriesList(res);
        setBrandsList(res2);
    }

    useEffect(() => {
        getInitData();
        if (initialData) {
            setValue('name', initialData.name);
            setValue('code', initialData.code);
            setValue('tax', initialData.tax);
            setValue('categoryId', initialData.categoryId);
            setValue('brandId', initialData.brandId);
            setValue('nameUr', initialData.nameUr);
            setValue('price', initialData.price);
            setValue('discount', initialData.discount);
            setValue('stock', initialData.stock);
            setValue('lowStockAlert', initialData.lowStockAlert);
        } else {
            reset();
        }
    }, [initialData]);

    async function onSubmit(data: any) {
        try {
            const res = await fetch('/api/product', {
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
            toast.success(initialData ? 'Product updated' : 'Product Added');
            onClose();
        } catch (error) {
            toast.error('Error: ' + (error as Error).message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-6/12">
                <h2 className="text-lg font-bold mb-4">
                    {initialData ? "Edit Product" : "Add Product"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-2">
                        <label className="block mb-2 font-medium">SKU</label>
                        <Input {...register('code')} type="text" placeholder="Enter code" />
                        {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code.message?.toString()}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="">
                            <label className="block mb-2 font-medium">Category</label>
                            <Select options={[]} {...register('categoryId', { valueAsNumber: true })}>
                                {categoriesList.map((cateogory) => (
                                    <option key={cateogory.id} value={cateogory.id} >{cateogory.name}</option>
                                ))}
                            </Select>
                            {errors.categoryId && <p className="text-sm text-red-500 mt-1">{errors.categoryId.message?.toString()}</p>}
                        </div>
                        <div className="">
                            <label className="block mb-2 font-medium">Brand</label>
                            <Select options={[]} {...register('brandId', { valueAsNumber: true })}>
                                {brandsList.map((brand) => (
                                    <option key={brand.id} value={brand.id} >{brand.name}</option>
                                ))}
                            </Select>
                            {errors.brandId && <p className="text-sm text-red-500 mt-1">{errors.brandId.message?.toString()}</p>}
                        </div>
                        <div className="">
                            <label className="block mb-2 font-medium">Name</label>
                            <Input {...register('name')} type="text" placeholder="Enter Name" />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message?.toString()}</p>}
                        </div>
                        <div className="">
                            <label className="block mb-2 font-medium">Name Urdu</label>
                            <Input {...register('nameUr')} type="text" placeholder="Enter Name in Urdu" />
                            {errors.nameUr && <p className="text-sm text-red-500 mt-1">{errors.nameUr.message?.toString()}</p>}
                        </div>
                        <div className="">
                            <label className="block mb-2 font-medium">Price</label>
                            <Input {...register('price', { valueAsNumber: true })} type="number" placeholder="Enter price" />
                            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message?.toString()}</p>}
                        </div>
                        <div className="">
                            <label className="block mb-2 font-medium">Discount</label>
                            <Input {...register('discount', { valueAsNumber: true })} type="number" step={0.01} placeholder="Enter discount" />
                            {errors.discount && <p className="text-sm text-red-500 mt-1">{errors.discount.message?.toString()}</p>}
                        </div>
                        <div className="">
                            <label className="block mb-2 font-medium">Stock</label>
                            <Input {...register('stock', { valueAsNumber: true })} type="number" placeholder="Enter stock" />
                            {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock.message?.toString()}</p>}
                        </div>
                        <div className="">
                            <label className="block mb-2 font-medium">Low Stock Alert</label>
                            <Input {...register('lowStockAlert', { valueAsNumber: true })} type="number" placeholder="Enter low stock alert" />
                            {errors.lowStockAlert && <p className="text-sm text-red-500 mt-1">{errors.lowStockAlert.message?.toString()}</p>}
                        </div>
                        <div className="">
                            <label className="block mb-2 font-medium">Tax(%)</label>
                            <Input {...register('tax', { valueAsNumber: true })} type="number" step={0.01} placeholder="Enter tax %" />
                            {errors.tax && <p className="text-sm text-red-500 mt-1">{errors.tax.message?.toString()}</p>}
                        </div>
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
