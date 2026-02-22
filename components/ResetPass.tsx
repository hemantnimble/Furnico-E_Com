

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import axios from 'axios'
interface ResetPasswordProps {
    email: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ email }) => {
    const [open, setOpen] = useState(false)
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const sendOtp = async () => {
        if (!email || !email.includes('@')) {
            alert("Please enter a valid email address first.");
            return;
        }
        try {
            const response = await axios.post('/api/user/sendotp', { bodyEmail: email });
            alert("OTP sent successfully")
            setOpen(true)
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to send otp";
            alert(errorMessage);
        }
    }

    const handleResetPassword = async (e: any) => {
        e.preventDefault();
        setError('')
        if (otp.length !== 6) {
            setError('OTP must be 6 digits')
            return
        }
        else if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }
        else if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        try {
            const response = await axios.post('/api/user/resetpassword', { otp, newPassword, bodyEmail: email });
            setError(response.data.message);
            if (response.data.message === "Password reset successful") {
                setOpen(false);
                alert("Password reset successful")
            }
        } catch (error) {
            console.error(error);
            setError("Error resetting password. Please try again.");
            alert("Failed to reset password. Please try again.");
        }
    };

    return (
        <div>
            <button type="button" className='text-sm font-semibold text-blue-600 underline decoration-2' onClick={sendOtp}>Recover Account</button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                            Enter your OTP and new password to reset your account password.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="otp">One-Time Password (OTP)</Label>
                            <Input
                                id="otp"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button type="submit" className="w-full">
                            Reset Password
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}


export default ResetPassword