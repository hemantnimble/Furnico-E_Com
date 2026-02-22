import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse, NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;

    // Return an error response if userId is not defined
    if (!userId) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    try {
        // Add or update the cart item
        const adCart = await db.cartItem.upsert({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
            update: {
                quantity: {
                    increment: quantity,
                },
            },
            create: {
                userId,
                productId,
                quantity,
            },
        });

        // Fetch the product details
        const product = await db.products.findUnique({
            where: {
                id: productId,
            },
            select: {
                id: true,
                title: true,
                price: true,
                images: true,
            },
        });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Return the cart item with product details
        return NextResponse.json(
            {
                adCart: {
                    ...adCart,
                    product, // Include the product data
                },
            },
            { status: 200 }
        );

    } catch (err: any) {
        console.log(err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}