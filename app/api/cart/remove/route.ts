import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;
    const { id } = await req.json();

    if (!userId) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }


    try {
        const removeItem = await db.cartItem.delete({
            where: {
                id
            },
        })
        return NextResponse.json({ removeItem }, { status: 200 });

    } catch (err: any) {
        console.log(err)
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
