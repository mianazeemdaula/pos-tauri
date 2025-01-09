import { db } from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const types = await db.paymentType.findMany({});
    return NextResponse.json(types);
}