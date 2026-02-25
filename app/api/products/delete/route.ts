// app/api/products/delete/route.ts
import { db } from '@/db';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { demoBlock } from '@/utils/demoGuard';

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const role = session.user.roles as unknown as string;
  const rolesArr = Array.isArray(role) ? role : [role];
  const isAdminOrDemoAdmin = rolesArr.includes('ADMIN') || rolesArr.includes('DEMO_ADMIN');

  if (!isAdminOrDemoAdmin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  // ── Block demo admin ──────────────────────────────────────────────────────
  const block = demoBlock(session.user.roles);
  if (block) {
    return NextResponse.json({ message: block }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
    }

    await db.cartItem.deleteMany({ where: { productId: id } });
    await db.orderItem.deleteMany({ where: { productId: id } });
    const deletedProduct = await db.products.delete({ where: { id } });

    return NextResponse.json(deletedProduct, { status: 200 });
  } catch (err: any) {
    console.error('[products/delete]', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}