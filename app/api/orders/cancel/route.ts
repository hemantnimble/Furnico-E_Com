import { auth } from '@/auth';
import { db } from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { orderId } = await req.json();

        if (!orderId || typeof orderId !== 'string') {
            return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
        }

        // Make sure this order belongs to the user
        const order = await db.order.findFirst({
            where: { id: orderId, userId },
        });

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // Only allow cancellation if PENDING or PROCESSING
        if (!['PENDING', 'PROCESSING'].includes(order.status)) {
            return NextResponse.json(
                { message: `Cannot cancel an order with status: ${order.status}` },
                { status: 400 }
            );
        }

        const updated = await db.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        });

        return NextResponse.json({ order: updated }, { status: 200 });
    } catch (err: any) {
        console.error('[orders/cancel]', err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}