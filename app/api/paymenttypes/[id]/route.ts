import { db } from "@/prisma/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cat = await db.paymentType.findUnique({
            where: {
                id: Number(id),
            }
        });
        return Response.json(cat);
    } catch (error) {
        throw error;
    }
}