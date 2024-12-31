
"use server";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function login(data: FormData) {
    try {
        await signIn("credentials", data);
    } catch (error) {
        if (error instanceof AuthError && error.type === "CredentialsSignin") {
            return { error: "Wrong username or password" };
        }
        return { error: error as any };
    }
}

export async function logout() {
    await signOut();
    return redirect('/');
}
