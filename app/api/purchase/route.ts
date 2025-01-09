import { db } from "@/prisma/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page')) || 1;
        const pageSize = Number(url.searchParams.get('pageSize')) || 10;
        const skip = (page - 1) * pageSize; // Calculate how many records to skip
        const take = pageSize;
        const rows = await db.purchase.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: true,
                party: true,
                _count: {
                    select: { PurchaseDetail: true }
                },
            },
        });
        const totalPosts = await db.purchase.count({});
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
        const session = await auth();
        const userId = session?.user?.id || '';
        const partyId = Number(data.partyId);
        const total = Number(data.total);
        console.log(data);
        await db.$transaction(async (prisma) => {
            const purchase = await prisma.purchase.create({
                data: {
                    total,
                    discount: data.discount,
                    partyId: partyId,
                    userId: Number(userId),
                    invoiceDate: new Date(data.invoiceDate),
                    invoiceNo: data.invoiceNo.toString(),
                    purchseDate: new Date(data.purchaseDate),
                },
            });

            const items = data.items.map((item: any) => ({
                purchaseId: purchase.id,
                productId: item.id,
                quantity: Number(item.qty),
                discount: item.discount,
                price: item.price,
            }));

            await prisma.purchaseDetail.createMany({
                data: items,
            });

            const productUpdates = data.items.map(async (item: any) => {
                const product = await prisma.product.findFirst({
                    where: { id: item.id },
                });
                if (product) {
                    await prisma.product.update({
                        where: { id: product.id },
                        data: { stock: product.stock + Number(item.qty) },
                    });
                }
            });

            await Promise.all(productUpdates);

            let wallet = await prisma.ledger.findFirst({
                where: { partyId },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            await prisma.ledger.create({
                data: {
                    partyId,
                    reference: `Purchase of #[${purchase.id}]`,
                    debit: total,
                    credit: 0,
                    balance: wallet ? wallet.balance - total : -total,
                },
            });
        });
        return NextResponse.json({ message: 'success' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'error' }, { status: 500 });
    }
}
