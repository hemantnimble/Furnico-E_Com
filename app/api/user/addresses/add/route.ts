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
        const { name, street, city, state, zipCode } = await req.json();

        // Validate input
        if (!name || !street || !city || !state || !zipCode) {
            return NextResponse.json({ message: 'All address fields are required' }, { status: 400 });
        }

        // Create new address in the database
        const newAddress = await db.address.create({
            data: {
                userId, // This refers to the logged-in user's ID
                name,
                street,
                city,
                state,
                zipCode,
            },
        });

        // Respond with success
        return NextResponse.json({ message: 'Address added successfully', address: newAddress });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
