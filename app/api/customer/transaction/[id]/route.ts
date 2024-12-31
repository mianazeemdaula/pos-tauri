import { db } from "@/prisma/db";

export async function GET(
    req: Request,
    { params }: { params: { customer: string } }
) {
    try {
        const { customer } = await params;
        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page')) || 1;
        const pageSize = Number(url.searchParams.get('pageSize')) || 10;
        const search = url.searchParams.get('s') || '';
        const skip = (page - 1) * pageSize; // Calculate how many records to skip
        const take = pageSize;

        const wallet = await db.customerWallet.findFirst({
            where: {
                customerId: customer,
            },
        });
        if (!wallet) {
            return Response.json({ error: "Wallet not found" }, { status: 404 });
        }
        const rows = await db.customerWalletTransaction.findMany({
            skip,
            take,
            where: {
                customerWalletId: wallet.id,
                AND: {
                    description: {
                        contains: search,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const totalPosts = await db.customerWalletTransaction.count({
            where: {
                customerWalletId: wallet.id,
            },
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