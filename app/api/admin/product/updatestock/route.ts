import { db } from '@/db';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (!session.user.roles?.includes('ADMIN')) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const { id, stock } = await req.json();

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
        }

        const stockInt = parseInt(stock, 10);
        if (isNaN(stockInt) || stockInt < 0) {
            return NextResponse.json({ message: 'Invalid stock value' }, { status: 400 });
        }

        const updatedProduct = await db.products.update({
            where: { id },
            data: { stock: stockInt },
        });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error: any) {
        console.error('[admin/updatestock]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}