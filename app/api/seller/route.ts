import { db } from "@/prisma/db"
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page')) || 1;
        const pageSize = Number(url.searchParams.get('pageSize')) || 15;
        const search = url.searchParams.get('s') || '';
        const skip = (page - 1) * pageSize; // Calculate how many records to skip
        const take = pageSize;
        const rows = await db.party.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                ledgers: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
            where: {
                OR: [
                    {
                        name: {
                            contains: search,
                        },
                    },
                    {
                        phone: {
                            contains: search,
                        },
                    },
                    {
                        city: {
                            contains: search,
                        },
                    },
                    {
                        address: {
                            contains: search,
                        },
                    },
                ],
            },
        });
        const total = await db.party.count({});
        const totalPages = Math.ceil(total / take);
        return Response.json({
            rows,
            meta: { total, totalPages, currentPage: page },
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const seller = await db.party.update({
            where: {
                id: data.id
            },
            data: data
        });
        return Response.json(seller);
    } catch (error) {
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log(data);
        const seller = await db.party.create({
            data: data,
        });
        return Response.json(seller);
    } catch (error) {
        throw error;
    }
}