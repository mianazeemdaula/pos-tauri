import { db } from "@/prisma/db"
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page')) || 1;
        const pageSize = Number(url.searchParams.get('pageSize')) || 15;
        const search = url.searchParams.get('s') || '';
        const skip = (page - 1) * pageSize; // Calculate how many records to skip
        const take = pageSize;
        const rows = await db.product.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                OR: [
                    {
                        name: {
                            contains: search,
                        },
                    },
                    {
                        code: {
                            contains: search,
                        },
                    },
                    {
                        nameUr: {
                            contains: search,
                        },
                    },
                ],
            },
        });
        const total = await db.product.count({});
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
        const product = await db.product.update({
            where: {
                id: data.id
            },
            data: data
        });
        return Response.json(product);
    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // try {
    const data = await request.json();
    console.log(data);
    const product = await db.product.create({
        data: data,
    });
    return Response.json(product);
    // } catch (error) {
    //     return Response.json({ error: (error as Error).message }, { status: 500 });
    // }
}