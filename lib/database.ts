"use server";
import { db } from "@/prisma/db";

export async function products() {
    const rows = await db.product.findMany({});
    return rows;
}

export async function sales({ user = false, customer = false }: { user?: boolean, customer?: boolean }) {
    const rows = await db.sale.findMany({
        include: {
            user: user,
            party: customer,
            _count: {
                select: { items: true }
            },
        },
    });
    return rows;
}

export async function categories() {
    const rows = await db.category.findMany({});
    return rows;
}

export async function brands() {
    const rows = await db.brand.findMany({});
    return rows;
}

export async function customers() {
    const rows = await db.party.findMany({
    });
    return rows;
}

export async function getPartyById(id: number) {
    const row = await db.party.findUnique({
        where: {
            id: id
        }
    });
    return row;
}

export async function parties() {
    const rows = await db.party.findMany({});
    return rows;
}

export async function paymentTypes() {
    const rows = await db.paymentType.findMany({});
    return rows;
}