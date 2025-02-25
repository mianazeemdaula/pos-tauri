import { db } from "@/prisma/db"


export async function GET() {
    try {
        const types = await db.paymentType.findMany({});
        return Response.json(types);
    } catch (error) {
        throw error;
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const type = await db.paymentType.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                accountNo: data.accountNo,
            }
        });
        return Response.json(type);
    } catch (error) {
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const slug = data.name.toLowerCase().replace(/ /g, '-');
        const cat = await db.paymentType.create({
            data: {
                name: data.name,
                accountNo: data.accountNo,
            }
        });
        return Response.json(cat);
    } catch (error) {
        throw error;
    }
}