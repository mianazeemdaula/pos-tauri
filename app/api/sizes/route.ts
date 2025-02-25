import { db } from "@/prisma/db"


export async function GET() {
    try {
        const sizes = await db.size.findMany({});
        return Response.json(sizes);
    } catch (error) {
        throw error;
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const cat = await db.size.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
            }
        });
        return Response.json(cat);
    } catch (error) {
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const slug = data.name.toLowerCase().replace(/ /g, '-');
        const cat = await db.size.create({
            data: {
                name: data.name,
            }
        });
        return Response.json(cat);
    } catch (error) {
        throw error;
    }
}