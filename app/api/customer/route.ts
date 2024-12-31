import { db } from "@/prisma/db"


export async function GET() {
    try {
        const customers = await db.customer.findMany({});
        return Response.json(customers);
    } catch (error) {
        throw "Somthing went wrong";
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