// pages/api/cart.ts
import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const session = await auth();
  const userId =  session?.user?.id

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch only the cart items belonging to the logged-in user
    const cartItems = await db.cartItem.findMany({
      where: { userId }, // Filter cart items by the logged-in user's ID
      include: { product: true }, // Include product details if needed
    });

    return NextResponse.json({cartItems:cartItems}, { status: 200 });
  } catch (err:any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
