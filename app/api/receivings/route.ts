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
        const rows = await db.customerWalletTransaction.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                wallet: {
                    include: {
                        customer: true,
                    },
                },
            },
            where: {
                type: {
                    equals: 'payment',
                },
                AND: {
                    OR: [
                        {
                            wallet: {
                                customer: {
                                    name: {
                                        contains: url.searchParams.get('s') || '',
                                    },
                                },
                            },
                        },
                        {
                            description: {
                                contains: url.searchParams.get('s') || '',
                            },
                        },
                    ]
                },
            },
        });
        const totalPosts = await db.customerWalletTransaction.count({
            where: {
                type: {
                    equals: 'payment',
                }
            }
        });
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
        const customerId = data.customerId;
        const total = Number(data.amount);
        await db.$transaction(async (prisma) => {

            let wallet = await prisma.customerWallet.findFirst({
                where: { customerId },
            });

            if (!wallet) {
                wallet = await prisma.customerWallet.create({
                    data: {
                        customerId,
                        balance: total,
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
                    type: 'payment',
                    description: data.description,
                    walletId: wallet.id,
                },
            });
        });
        return NextResponse.json({ message: 'success' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'error' }, { status: 500 });
    }
}
