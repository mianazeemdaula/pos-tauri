"use client";
import { login } from "@/lib/actions/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export default function Home() {

  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  async function handSignin(data: any) {
    try {
      setLoading(true);
      const result = await login(data);
      if (result && result.error && typeof result.error === "string") {
        toast.error(result.error);
      } else {
        toast.success("Logged in successfully");
        router.replace("/admin")
      }
    } catch (error) {
      toast.error((error as any).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start bg-gray-100 p-8 rounded-md">
        <h2 className="uppercase text-primary font-bold">Bismillah Sanitary Store</h2>
        <form onSubmit={handleSubmit(handSignin)}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-pirmary">
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register("username")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            />
            {errors.username?.message && <p className="text-red-500 text-xs">{errors.username.message.toString()}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {errors.password?.message && <p className="text-red-500 text-xs">{errors.password.message.toString()}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Sign in
          </button>
        </form>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div >
  );
}
