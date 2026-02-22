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

        // Parse request body
        const { name, street, city, state, zip,addressId } = await req.json();

        // Validate input
        if (!name || !street || !city || !state || !zip) {
            return NextResponse.json({ message: 'All address fields are required' }, { status: 400 });
        }

        const updatedAddress = await db.address.update({
            where: {
                userId: userId,
                id: addressId,
            },
            data: {
                name,
                street,
                city,
                state,
                zipCode:zip,
            },
        });

        // Respond with success
        return NextResponse.json({ message: 'Address added successfully', address: updatedAddress });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
