import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse, NextRequest } from "next/server";
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;
    try {

        if (!userId) {
            return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
        }

        const { addressId } = await req.json();

        if (!addressId) {
            return NextResponse.json({ message: 'All address fields are required' }, { status: 400 });
        }

        const deletedAddress = await db.address.delete({
            where: {
                userId: userId,
                id: addressId
            },
        });

        return NextResponse.json({ message: 'Address deleted successfully', address: deletedAddress });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
