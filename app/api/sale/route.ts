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
        const rows = await db.order.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: true,
                customer: true,
                _count: {
                    select: { OrderDetail: true }
                },
            },
        });
        const totalPosts = await db.order.count({});
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
        const customerId = data.customer_id;
        const total = Number(data.total);

        await db.$transaction(async (prisma) => {
            const sale = await prisma.order.create({
                data: {
                    total,
                    userId,
                    customerId,
                },
            });

            const orderDetails = data.items.map((item: any) => ({
                orderId: sale.id,
                productId: item.id,
                quantity: Number(item.qty),
                discount: item.discount,
                price: item.price,
            }));

            await prisma.orderDetail.createMany({
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

            let wallet = await prisma.customerWallet.findFirst({
                where: { customerId },
            });

            if (!wallet) {
                wallet = await prisma.customerWallet.create({
                    data: {
                        customerId,
                        balance: -total,
                    },
                });
            } else {
                wallet = await prisma.customerWallet.update({
                    where: { id: wallet.id },
                    data: { balance: wallet.balance - total },
                });
            }

            await prisma.customerWalletTransaction.create({
                data: {
                    amount: total,
                    type: 'sale',
                    description: `Sale of #[${sale.id}]`,
                    customerWalletId: wallet.id,
                },
            });
        });
        return NextResponse.json({ message: 'success' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'error' }, { status: 500 });
    }
}
