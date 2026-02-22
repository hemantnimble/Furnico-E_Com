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
        const { id, title, stock, price, images, category } = await req.json();

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
        }

        const priceFloat = parseFloat(price);
        const stockInt = parseInt(stock, 10);

        if (isNaN(priceFloat) || priceFloat < 0) {
            return NextResponse.json({ message: 'Invalid price value' }, { status: 400 });
        }
        if (isNaN(stockInt) || stockInt < 0) {
            return NextResponse.json({ message: 'Invalid stock value' }, { status: 400 });
        }

        const updatedProduct = await db.products.update({
            where: { id },
            data: {
                title,
                price: priceFloat,
                stock: stockInt,
                images: images ?? [],
                category,
            },
        });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error: any) {
        console.error('[products/update]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}