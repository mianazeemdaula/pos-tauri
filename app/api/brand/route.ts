import { db } from "@/prisma/db"


export async function GET() {
    try {
        const cats = await db.brand.findMany({});
        return Response.json(cats);
    } catch (error) {
        throw error;
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const cat = await db.brand.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                slug: data.name.toLowerCase().replace(/ /g, '-')
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
        const cat = await db.brand.create({
            data: {
                name: data.name,
                slug: slug
            }
        });
        return Response.json(cat);
    } catch (error) {
        throw error;
    }
}