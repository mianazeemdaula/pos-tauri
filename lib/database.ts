"use server";

import { db } from "@/prisma/db";

export async function products() {
    const rows = await db.product.findMany({});
    return rows;
}

export async function sales({ user = false, customer = false }: { user?: boolean, customer?: boolean }) {
    const rows = await db.order.findMany({
        include: {
            user: user,
            customer: customer,
            _count: {
                select: { OrderDetail: true }
            },
        },
    });
    return rows;
}

export async function categories() {
    const rows = await db.category.findMany({});
    return rows;
}

export async function customers() {
    const rows = await db.customer.findMany({
        include: {
            wallet: true,
        }
    });
    return rows;
}

export async function sellers() {
    const rows = await db.seller.findMany({
        include: {
            wallet: true,
        }
    });
    return rows;
}