import { db } from "@/prisma/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cat = await db.category.findUnique({
            where: {
                id: id,
            }
        });
        return Response.json(cat);
    } catch (error) {
        throw error;
    }
}