"use client";

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import GoogleSignin from './GoogleSignin';
import { UserIcon, Eye, EyeOff } from 'lucide-react';
import ResetPassword from './ResetPass';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState<"admin" | "user" | null>(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const loginwithc = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        if (!name.trim()) {
            toast.error("Please enter your name.");
            setLoading(false);
            return;
        }
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        const login = await signIn("credentials", {
            email,
            password,
            name,
            redirect: false,
        });

        if (login?.error === null) {
            toast.success("Logged in successfully");
            router.replace("/");
        } else if (login?.error) {
            toast.error("Invalid Credentials");
        }
        setLoading(false);
    };

    // ── One-click demo login ───────────────────────────────────────────────
    const loginAsDemo = async (type: "admin" | "user") => {
        setDemoLoading(type);
        const credentials =
            type === "admin"
                ? { email: "demo-admin@furnico.demo", password: "demo1234", name: "Demo Admin" }
                : { email: "demo-user@furnico.demo",  password: "demo1234", name: "Demo User" };

        const login = await signIn("credentials", { ...credentials, redirect: false });

        if (login?.error === null) {
            toast.success(`Logged in as Demo ${type === "admin" ? "Admin" : "User"}`);
            router.replace(type === "admin" ? "/admin/dashboard" : "/");
        } else {
            toast.error("Demo login failed. Make sure the seed script has been run.");
        }
        setDemoLoading(null);
    };

    const togglePasswordVisibility = () => setShowPassword(p => !p);

    return (
        <>
            <Toaster />

            {/* ── Demo Buttons ──────────────────────────────────────────────── */}
            <div className="mb-4 flex flex-col gap-2 min-w-[21rem]">
                <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">
                    👀 Try without signing up
                </p>

                {/* Demo Admin */}
                <button
                    type="button"
                    disabled={demoLoading !== null}
                    onClick={() => loginAsDemo("admin")}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-60"
                >
                    {demoLoading === "admin" ? (
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    )}
                    Try Demo — Admin View
                </button>

                {/* Demo User */}
                <button
                    type="button"
                    disabled={demoLoading !== null}
                    onClick={() => loginAsDemo("user")}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:border-gray-900 transition-colors disabled:opacity-60"
                >
                    {demoLoading === "user" ? (
                        <span className="w-4 h-4 rounded-full border-2 border-gray-700 border-t-transparent animate-spin" />
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    )}
                    Try Demo — Customer View
                </button>

                <div className="flex items-center gap-2 my-1">
                    <hr className="flex-1 border-gray-200" />
                    <span className="text-xs text-gray-400">or sign in</span>
                    <hr className="flex-1 border-gray-200" />
                </div>
            </div>

            {/* ── Regular Sign In Form ──────────────────────────────────────── */}
            <form className="signin-form" onSubmit={loginwithc}>
                <div className="flex-column">
                    <label>Name</label>
                    <div className="inputForm">
                        <UserIcon />
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            required
                            type="text"
                            className="input"
                            placeholder="Enter your name"
                        />
                    </div>
                </div>
                <div className="flex-column">
                    <label>Email</label>
                    <div className="inputForm">
                        <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg"><g id="Layer_3" data-name="Layer 3"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" /></g></svg>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                            autoComplete="email"
                            type="email"
                            className="input"
                            placeholder="Enter your Email"
                        />
                    </div>
                </div>
                <div className="flex-column">
                    <label>Password</label>
                    <div className="inputForm">
                        <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" /><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" /></svg>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            type={showPassword ? "text" : "password"}
                            required
                            autoComplete="current-password"
                            className="input"
                            placeholder="Enter your Password"
                        />
                        {showPassword ? (
                            <Eye className='mr-3 cursor-pointer' onClick={togglePasswordVisibility} />
                        ) : (
                            <EyeOff className='mr-3 cursor-pointer' onClick={togglePasswordVisibility} />
                        )}
                    </div>
                </div>
                <div className="flex-row">
                    <ResetPassword email={email} />
                </div>
                <button type="submit" className="button-submit" disabled={loading}>
                    {loading ? (
                        <svg aria-hidden="true" role="status" className="inline w-6 h-6 me-3 text-white animate-spin text-center" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                        </svg>
                    ) : (
                        'Sign In'
                    )}
                </button>
                <p className="p line">Or With</p>
            </form>
            <GoogleSignin />
        </>
    );
}