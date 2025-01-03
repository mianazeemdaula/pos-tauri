import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const s = url.searchParams.get('s') || '';
    const products = await db.product.findMany({
        where: {
            OR: [
                { name: { contains: s } },
                { code: { contains: s } },
            ]
        }
    });
    return NextResponse.json(products);
}