import { db } from "@/db";
import { NextResponse, NextRequest } from "next/server";
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
    try {
        const { id } = await req.json(); // Parse the JSON body of the request
        const product = await db.products.findUnique({
            where: { id: id },
            include: { reviews: true }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
