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
        const customers = await db.customer.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                wallet: true,
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
        const total = await db.customer.count({});
        const totalPages = Math.ceil(total / take);
        return Response.json({
            customers,
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
        const customer = await db.customer.update({
            where: {
                id: data.id
            },
            data: data
        });
        return Response.json(customer);
    } catch (error) {
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const customer = await db.customer.create({
            data: data,
        });
        return Response.json(customer);
    } catch (error) {
        throw error;
    }
}