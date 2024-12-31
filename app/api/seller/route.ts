import { db } from "@/prisma/db"


export async function GET() {
    try {
        const sellers = await db.seller.findMany({});
        return Response.json(sellers);
    } catch (error) {
        throw "Somthing went wrong";
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const seller = await db.seller.update({
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
        const seller = await db.seller.create({
            data: data,
        });
        return Response.json(seller);
    } catch (error) {
        throw error;
    }
}