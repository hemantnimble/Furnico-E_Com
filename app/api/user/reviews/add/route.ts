import { db } from '@/db';
import { auth } from '@/auth';
import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    try {
        const { content, rating, productId } = await req.json();

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ message: 'Review content is required' }, { status: 400 });
        }
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json({ message: 'Rating must be between 1 and 5' }, { status: 400 });
        }
        if (!productId || typeof productId !== 'string') {
            return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
        }

        // Server-side check: user must have ordered this product
        const hasOrdered = await db.orderItem.findFirst({
            where: {
                productId,
                order: { userId },
            },
        });

        if (!hasOrdered) {
            return NextResponse.json(
                { message: 'You can only review products you have purchased' },
                { status: 403 }
            );
        }

        // Prevent duplicate reviews
        const existingReview = await db.review.findFirst({
            where: { productId, userId },
        });

        if (existingReview) {
            return NextResponse.json(
                { message: 'You have already reviewed this product' },
                { status: 409 }
            );
        }

        const review = await db.review.create({
            data: {
                content: content.trim(),
                rating,
                product: { connect: { id: productId } },
                user: { connect: { id: userId } },
            },
        });

        return NextResponse.json({ message: 'Review added successfully', review });
    } catch (error: any) {
        console.error('[reviews/add]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}