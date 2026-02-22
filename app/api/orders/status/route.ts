import { auth } from "@/auth";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { orderId, status } = await req.json();

    // Validate input
    if (!orderId || !status || !["PENDING", "DELIVERED", "CANCELLED"].includes(status)) {
        return NextResponse.json({ message: "Invalid data provided" }, { status: 400 });
    }
    try {
        // Find the order
        const order = await db.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        // Ensure that the user is authorized to update the status (e.g., is an admin or the owner)
        const userRole = session.user.roles || [];
        const isAdmin = userRole.includes("ADMIN");
        const isOrderOwner = order.userId === session.user.id;

        if (!isAdmin && !isOrderOwner) {
            return NextResponse.json({ message: "Not authorized to change this order's status" }, { status: 403 });
        }
        // Update the status
        const updatedOrder = await db.order.update({
            where: { id: orderId },
            data: { status },
        });


        return NextResponse.json({ updatedOrder }, { status: 200 });
    } catch (err: any) {
        console.error("Error fetching orders:", err);
        return NextResponse.json({ message: err }, { status: 500 });

    }
}