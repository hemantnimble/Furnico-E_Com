import { db } from "@/db";
import { NextResponse, NextRequest } from "next/server";
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
    const { category } = await req.json();
    try {
        let products;
        if (category && category !== 'All') {
            products = await db.products.findMany({
                where: { category: category as string },
                include: { reviews: true }
            });
        } else {
            products = await db.products.findMany({
                include: { reviews: true }
            }); // Fetch all products
        }
        return NextResponse.json({ products });
    } catch (error: any) {
        console.log("errrrr", error)
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
