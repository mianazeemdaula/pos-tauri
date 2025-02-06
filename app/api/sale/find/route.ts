import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = Number(url.searchParams.get('id'));
        const r = await db.sale.findUnique({
            where: { id: id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: true,
                party: true,
            },
        });
        return NextResponse.json(r);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}