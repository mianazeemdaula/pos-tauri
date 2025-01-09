import { db } from "@/prisma/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page')) || 1;
        const pageSize = Number(url.searchParams.get('pageSize')) || 15;
        const skip = (page - 1) * pageSize; // Calculate how many records to skip
        const take = pageSize;
        const rows = await db.payment.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                party: true,
                paymentType: true,
            },
            where: {
                AND: {
                    ispayment: false,
                    OR: [
                        {
                            party: {
                                name: {
                                    contains: url.searchParams.get('s') || '',
                                },
                            },
                        },
                        {
                            note: {
                                contains: url.searchParams.get('s') || '',
                            },
                        },
                    ]
                }
            },
        });
        const totalPosts = await db.payment.count({});
        const totalPages = Math.ceil(totalPosts / take);
        return Response.json({
            rows,
            meta: { totalPosts, totalPages, currentPage: page },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const partyId = data.partyId;
        const total = Number(data.amount);
        console.log(data);
        await db.$transaction(async (prisma) => {
            await prisma.payment.create({
                data: {
                    partyId,
                    amount: total,
                    note: data.note,
                    ispayment: false,
                    paymentTypeId: data.paymentTypeId,
                },
            });

            let ledger = await prisma.ledger.findFirst({
                where: { partyId },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            await prisma.ledger.create({
                data: {
                    partyId,
                    reference: data.note,
                    debit: total,
                    credit: 0,
                    balance: ledger ? ledger.balance - total : -total,
                },
            });
        });
        return NextResponse.json({ message: 'success' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'error' }, { status: 500 });
    }
}
