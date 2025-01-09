import { db } from "@/prisma/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page')) || 1;
        const pageSize = Number(url.searchParams.get('pageSize')) || 10;
        const search = url.searchParams.get('s') || '';
        const skip = (page - 1) * pageSize; // Calculate how many records to skip
        const take = pageSize;
        const rows = await db.ledger.findMany({
            skip,
            take,
            where: {
                partyId: Number(id),
                AND: {
                    reference: {
                        contains: search,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const totalPosts = await db.ledger.count({
            where: {
                partyId: Number(id),
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