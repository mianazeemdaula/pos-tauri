import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const rows = await db.$queryRaw`
        SELECT 
        s.saleId,
        s.productId,
        s.quantity,
        s.price * s.quantity AS total_sale,
        ph.price * s.quantity AS total_cost,
        (s.price * s.quantity) - (ph.price * s.quantity) AS profit
        FROM 
        SaleDetail s
        JOIN 
        price_history ph ON s.productId = ph.productId
        WHERE 
        ph.effective_date = (
        SELECT MAX(effective_date)
        FROM price_history
        WHERE productId = s.productId AND DATE(effective_date) <= DATE(s.createdAt)
        ) AND DATE(s.createdAt) = CURRENT_DATE
        ORDER BY 
        s.createdAt DESC;
        `;
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}