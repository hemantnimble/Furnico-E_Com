import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (!session.user.roles?.includes('ADMIN')) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const { title, price, category, images, stock } = await req.json();

        if (!title || price === undefined || !category || stock === undefined) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const priceFloat = parseFloat(price);
        const stockInt = parseInt(stock, 10);

        if (isNaN(priceFloat) || priceFloat < 0) {
            return NextResponse.json({ message: 'Invalid price value' }, { status: 400 });
        }
        if (isNaN(stockInt) || stockInt < 0) {
            return NextResponse.json({ message: 'Invalid stock value' }, { status: 400 });
        }

        const result = await db.products.create({
            data: {
                title,
                price: priceFloat,
                category,
                stock: stockInt,
                images: images ?? [],
            },
        });

        return NextResponse.json(result, { status: 201 });
    } catch (err: any) {
        console.error('[products/add]', err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}