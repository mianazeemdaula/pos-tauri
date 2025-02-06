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
        const rows = await db.saleReturn.findMany({
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
        const totalPosts = await db.saleReturn.count({});
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
        const totalNetAmount = (Number(data.total) - Number(data.discount)) + Number(data.tax);
        const cash = Number(data.cash);
        await db.$transaction(async (prisma) => {
            const sale = await prisma.sale.findUnique({
                where: { id: Number(data.saleId) },
            });
            const saleReturn = await prisma.saleReturn.create({
                data: {
                    total: totalNetAmount,
                    userId,
                    partyId: sale?.partyId,
                    paymentTypeId: data.paymentTypeId, // or any appropriate value
                    discount: data.discount,
                    discount2: data.discount2,
                    tax: data.tax,
                },
            });

            const orderDetails = data.items.map((item: any) => ({
                saleId: saleReturn.id,
                productId: item.id,
                quantity: Number(item.qty),
                discount: item.discount,
                tax: item.tax,
                price: item.price,
            }));

            await prisma.saleReturnDetail.createMany({
                data: orderDetails,
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
                        balance: tbalance?.balance ? Number(tbalance.balance) - amount : -amount,
                        note: `Sale return of sale #[${saleReturn.id}]`,
                    },
                });

                if (totalNetAmount > cash && sale?.partyId) {
                    let balance = await prisma.ledger.findFirst({
                        where: { partyId: sale?.partyId },
                        orderBy: { createdAt: 'desc' },
                    });
                    let payable = totalNetAmount - cash;
                    payable = payable < 0 ? totalNetAmount : payable;
                    await prisma.ledger.create({
                        data: {
                            openBalance: balance?.balance || 0.00,
                            debit: payable,
                            balance: balance?.balance ? Number(balance.balance) + payable : payable,
                            reference: `Sale return of #[${saleReturn.id}]`,
                            partyId: sale?.partyId,
                        },
                    });
                }
            }
        });
        const salePrint = await db.saleReturn.findFirst({
            where: { id: data.id },
            include: {
                user: true,
                party: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return NextResponse.json({ message: 'success', data: salePrint });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

