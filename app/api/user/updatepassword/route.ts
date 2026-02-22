import { auth } from "@/auth";
import { db } from "@/db";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    const { oldPass, newPass } = await req.json();
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }
    if (oldPass === newPass) {
        return NextResponse.json({ message: "Current and new password is same" }, { status: 404 });
    }

    try {
        // Fetch the user from the database
        const user = await db.user.findUnique({
            where: {
                email: session.user.email as string,
            },
        });

        // Check if the user exists and if the hashedPassword is defined
        if (!user || !user.email || !user.hashedPassword) {
            return NextResponse.json({ message: "User not found or password is not set" }, { status: 404 });
        }

        // Compare the current password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(oldPass, user.hashedPassword);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Current password is incorrect" }, { status: 401 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPass, 10);

        // Update the user's password in the database
        await db.user.update({
            where: { email: user.email as string },  // Safe to cast to string after check
            data: { hashedPassword: hashedPassword },
        });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
