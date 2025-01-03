import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ sku: string }> }) {
    const { sku } = await params;
    const product = await db.product.findFirst({
        where: {
            code: {
                contains: sku,
            },
        }
    });
    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
}