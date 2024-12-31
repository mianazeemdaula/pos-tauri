import { db } from "@/prisma/db"


export async function GET() {
    try {
        const products = await db.product.findMany({});
        return Response.json(products);
    } catch (error) {
        throw "Somthing went wrong";
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
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log(data);
        const product = await db.product.create({
            data: data,
        });
        return Response.json(product);
    } catch (error) {
        throw error;
    }
}