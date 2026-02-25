import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }
    if (!session.user.roles.includes('ADMIN')) {
        return NextResponse.json({ message: "User not authorized" }, { status: 403 });
    }

    try {
        const orders = await db.orderItem.findMany({
            include: {
                order: true,
                product: true,
            }
        });

        // Fetch user names separately to avoid crash on deleted users
        const userIds = [...new Set(orders.map(o => o.order?.userId).filter(Boolean))] as string[];
        const users = await db.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true },
        });
        const userMap = Object.fromEntries(users.map(u => [u.id, u.name]));

        // Attach user name manually
        const safeOrders = orders.map(item => ({
            ...item,
            order: item.order ? {
                ...item.order,
                user: { name: userMap[item.order.userId] ?? 'Deleted User' },
            } : null,
        }));

        return NextResponse.json({ orders: safeOrders }, { status: 200 });
    } catch (err) {
        console.error("err getting orders", err);
        return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
    }
}