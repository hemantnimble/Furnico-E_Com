'use client';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import ResetPassword from "@/components/ResetPass";

export default function Profile() {
  const { data: session } = useSession();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/user/updatepassword', { oldPass, newPass });
      setSaved(true);
      setOldPass("");
      setNewPass("");
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <Link href="/user/account"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Account
          </Link>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">Settings</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Profile</h1>
          <div className="mt-4 border-b border-gray-200" />
        </div>

        {/* ── User info card ── */}
        {session && (
          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Account Info</p>
            <div className="flex items-center gap-4">
              {session.user?.image ? (
                <img src={session.user.image} alt={session.user.name || 'User'}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold shrink-0 select-none">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-base truncate">{session.user?.name || '—'}</p>
                <p className="text-sm text-gray-400 truncate mt-0.5">{session.user?.email || '—'}</p>
              </div>
            </div>

            {/* Fields */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-white border border-gray-100 px-4 py-3">
                <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">Full Name</p>
                <p className="text-sm font-semibold text-gray-800">{session.user?.name || '—'}</p>
              </div>
              <div className="rounded-xl bg-white border border-gray-100 px-4 py-3">
                <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">Email Address</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{session.user?.email || '—'}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Password card ── */}
        <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Security</p>
          <h2 className="text-base font-bold text-gray-900 mb-5">Change Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Current password */}
              <div>
                <label htmlFor="old-password" className="block text-xs font-medium text-gray-500 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="old-password"
                    type={showPassword ? "text" : "password"}
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors pr-10"
                  />
                </div>
              </div>

              {/* New password */}
              <div>
                <label htmlFor="new-password" className="block text-xs font-medium text-gray-500 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors pr-10"
                  />
                </div>
              </div>
            </div>

            {/* Show/hide toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  Hide passwords
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Show passwords
                </>
              )}
            </button>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={saving || !oldPass || !newPass}
                className="flex items-center gap-2 rounded-full bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Saving…
                  </>
                ) : saved ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : (
                  'Save Password'
                )}
              </button>
            </div>
          </form>

          {/* Reset password */}
          <div className="mt-6 border-t border-gray-200 pt-5">
            <p className="text-xs text-gray-400 mb-2">Cannot remember your current password?</p>
            <ResetPassword email={session?.user?.email || ""} />
          </div>
        </div>

      </div>
    </div>
  );
}