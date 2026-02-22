import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;

    try {
        const { productId } = await req.json();

        const reviews = await db.review.findMany({
            where: { productId: String(productId) },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Filter out reviews where the user is null
        const validReviews = reviews.filter(review => review.user !== null);

        return NextResponse.json({ reviews: validReviews });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}