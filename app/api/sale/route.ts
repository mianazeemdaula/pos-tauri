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
        const rows = await db.sale.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: true,
                party: true,
                _count: {
                    select: { items: true }
                },
            },
        });
        const totalPosts = await db.sale.count({});
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
        const userId = Number(session?.user?.id);
        const partyId = data.partyId;
        const totalNetAmount = (Number(data.total) - Number(data.discount)) + Number(data.tax);
        const cash = Number(data.cash);
        await db.$transaction(async (prisma) => {
            const sale = await prisma.sale.create({
                data: {
                    total: totalNetAmount,
                    partyId: partyId ?? null,
                    userId,
                    paymentTypeId: data.paymentTypeId, // or any appropriate value
                    discount: data.discount,
                    discount2: data.discount2,
                    tax: data.tax,
                },
            });

            const orderDetails = data.items.map((item: any) => ({
                saleId: sale.id,
                productId: item.id,
                quantity: Number(item.qty),
                discount: item.discount,
                tax: (item.tax * item.qty * item.price) / 100,
                price: item.price,
            }));

            await prisma.saleDetail.createMany({
                data: orderDetails,
            });

            const productUpdates = data.items.map(async (item: any) => {
                const product = await prisma.product.findFirst({
                    where: { id: item.id },
                });
                if (product) {
                    await prisma.product.update({
                        where: { id: product.id },
                        data: { stock: product.stock - Number(item.qty) },
                    });
                }
            });

            await Promise.all(productUpdates);
            // update cash balance if cash is paid by customer
            if (cash >= 0) {
                let amount = totalNetAmount - cash;
                amount = amount > 0 ? cash : totalNetAmount;
                const tbalance = await prisma.transaction.findFirst({
                    where: { paymentTypeId: data.paymentTypeId },
                    orderBy: { createdAt: 'desc' },
                });
                await prisma.transaction.create({
                    data: {
                        openBalance: tbalance?.balance || 0.00,
                        paymentTypeId: data.paymentTypeId,
                        debit: amount,
                        balance: tbalance?.balance ? Number(tbalance.balance) + amount : amount,
                        note: `Sale of #[${sale.id}]`,
                    },
                });

                if (partyId && totalNetAmount > cash) {
                    let balance = await prisma.ledger.findFirst({
                        where: { partyId },
                        orderBy: { createdAt: 'desc' },
                    });
                    let payable = totalNetAmount - cash;
                    payable = payable < 0 ? totalNetAmount : payable;
                    await prisma.ledger.create({
                        data: {
                            openBalance: balance?.balance || 0.00,
                            debit: payable,
                            balance: balance?.balance ? Number(balance.balance) - payable : -payable,
                            reference: `Sale of #[${sale.id}]`,
                            partyId,
                        },
                    });
                }
            }
        });
        return NextResponse.json({ message: 'success' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
