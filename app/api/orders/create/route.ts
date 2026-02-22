import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse, NextRequest } from "next/server";

const prisma =  db;

export async function POST(req: NextRequest) {
    const { paymentIntentId, item, quantity, cartItems, selectedAddress } = await req.json();
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    try {
        let order;
        if (item) {
            // Single product order
            order = await prisma.order.create({
                data: {
                    userId,
                    paymentIntentId,
                    addressId: selectedAddress,
                    items: {
                        create: [
                            {
                                productId: item.id,
                                quantity: quantity,
                            },
                        ],
                    },
                },
                include: {
                    items: true,
                },
            });

            // Clear the cart item if needed
            await prisma.cartItem.deleteMany({
                where: {
                    userId: userId,
                    productId: item.id,
                },
            });
        } else if (cartItems && cartItems.length > 0) {
            // Multiple cart items order
            order = await prisma.order.create({
                data: {
                    userId,
                    paymentIntentId,
                    addressId: selectedAddress,
                    items: {
                        create: cartItems.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });

            const orderedProductIds = cartItems.map((item: any) => item.productId);
            await prisma.cartItem.deleteMany({
                where: {
                    userId: userId,
                    productId: {
                        in: orderedProductIds,
                    },
                },
            });
        } else {
            return NextResponse.json({ message: "No items provided" }, { status: 400 });
        }

        return NextResponse.json({ order }, { status: 200 });
    } catch (error: any) {
        console.log("Error during order creation:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}