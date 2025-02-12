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
        const rows = await db.expense.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: true,
                paymentType: true,
            },
            where: {
                note: {
                    contains: url.searchParams.get('s') || '',
                },
            },
        });
        const totalPosts = await db.expense.count({});
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
        const total = Number(data.amount);
        const session = await auth();
        await db.$transaction(async (prisma) => {
            const expense = await prisma.expense.create({
                data: {
                    amount: total,
                    note: data.note,
                    userId: Number(session?.user?.id ?? '0'),
                    paymentTypeId: data.paymentTypeId,
                    expenseDate: data.expenseDate,
                },
            });

            const tbalance = await prisma.transaction.findFirst({
                where: { paymentTypeId: data.paymentTypeId },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            await prisma.transaction.create({
                data: {
                    paymentTypeId: data.paymentTypeId,
                    balance: tbalance ? tbalance.balance - total : -total,
                    note: data.note,
                    credit: total,
                    openBalance: tbalance ? tbalance.balance : 0,
                },
            });
        });
        return NextResponse.json({ message: 'success' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'error' }, { status: 500 });
    }
}
