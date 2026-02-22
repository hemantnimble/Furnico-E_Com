import { NextResponse, NextRequest } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_PAYMENT_PUBLIC!,
    key_secret: process.env.PAYMENT_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const { amount } = await req.json();

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
        }

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // paise, ensure integer
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        });

        return NextResponse.json({ order }, { status: 200 });
    } catch (error: any) {
        console.error('[createrazor]', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

/**
 * POST /api/orders/verifyrazor
 * Call this from the Razorpay handler callback before creating the DB order.
 */
export async function PUT(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ message: 'Missing verification fields' }, { status: 400 });
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.PAYMENT_SECRET!)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ message: 'Invalid payment signature' }, { status: 400 });
        }

        return NextResponse.json({ verified: true }, { status: 200 });
    } catch (error: any) {
        console.error('[verifyrazor]', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}