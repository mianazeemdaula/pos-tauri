import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const s = url.searchParams.get('s') || '';
    const products = await db.product.findMany({
        where: {
            OR: [
                { name: { contains: s } },
                { nameUr: { contains: s } },
                { code: { contains: s } },
            ]
        },
        include: {
            size: true,
            brand: true,
        }
    });
    return NextResponse.json(products);
}