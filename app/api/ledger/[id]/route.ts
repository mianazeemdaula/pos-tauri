import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const rows = await db.transaction.findMany({
            where: {
                paymentTypeId: Number(id),
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}