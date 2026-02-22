import { db } from '@/db';
import { auth } from '@/auth';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    try {
        const { id, quantity } = await req.json();
        // id here is the CartItem.id (not productId)

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ message: 'Invalid cart item id' }, { status: 400 });
        }
        if (typeof quantity !== 'number' || quantity < 1) {
            return NextResponse.json({ message: 'Invalid quantity' }, { status: 400 });
        }

        // Verify the cart item belongs to this user before updating
        const existing = await db.cartItem.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            return NextResponse.json({ message: 'Cart item not found' }, { status: 404 });
        }

        const cartItem = await db.cartItem.update({
            where: { id },
            data: { quantity },
        });

        return NextResponse.json({ cartItem }, { status: 200 });
    } catch (err: any) {
        console.error('[cart/update]', err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}