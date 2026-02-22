import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const session = await auth();
    const sessionEmail = session?.user?.email;
    const bodyEmail = await req.json();
    const email = bodyEmail.bodyEmail || sessionEmail;
    console.log(email)
    if (!email) {
        return NextResponse.json({ message: 'Email not found in session.' }, { status: 400 });
    }
    console.log(email)

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        try {
            await prisma.user.update({
                where: { email },
                data: {
                    otp,
                    otpExpiry,
                },
            });
        } catch (dbError: any) {
            console.error("Database error during OTP update:", dbError);
            return NextResponse.json({ success: false, error: 'Failed to update user OTP in database.' }, { status: 500 });
        }

        sgMail.setApiKey(process.env.SEND_GRID_API || '');

        const body = `OTP to reset your password is: ${otp}`;
        const msg = {
            to: email,
            from: 'angel1kundlik@gmail.com',
            subject: 'Password Reset OTP',
            text: body,
        };

        try {
            await sgMail.send(msg);
        } catch (mailError: any) {
            console.error("MailGrid error:", mailError.response?.body || mailError);
            return NextResponse.json({ success: false, error: 'Failed to send OTP email. Please check server logs.' }, { status: 500 });
        }

        return NextResponse.json({ message: 'OTP sent to your email.' });
    } catch (error: any) {
        console.error("Unexpected error in sendotp route:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
