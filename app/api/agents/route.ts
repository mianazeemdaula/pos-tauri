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
        const agents = await db.saleAgent.findMany({
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
                        code: {
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
                    }
                ],
            },
        });
        const total = await db.saleAgent.count({});
        const totalPages = Math.ceil(total / take);
        return Response.json({
            agents,
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
        const agent = await db.saleAgent.update({
            where: {
                id: data.id
            },
            data: data
        });
        return Response.json(agent);
    } catch (error) {
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const agentcount = await db.saleAgent.count({});
        const code = 'BSS' + (agentcount + 1).toString().padStart(4, '0');
        data.code = code;
        const agent = await db.saleAgent.create({
            data: data,
        });
        return Response.json(agent);
    } catch (error) {
        throw error;
    }
}