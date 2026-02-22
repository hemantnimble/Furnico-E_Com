import { db } from "@/db";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
export async function GET() {
    try {
        const products = await db?.products.findMany()
        return NextResponse.json({
            products
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}