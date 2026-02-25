// components/DemoBanner.tsx
// Show this at the top of any page when the user is in a demo role.
'use client';

import { useSession } from 'next-auth/react';

export default function DemoBanner() {
    const { data: session } = useSession();
    const role = session?.user?.roles as unknown as string | string[] | undefined;

    const rolesArr = Array.isArray(role) ? role : role ? [role] : [];
    const isDemo  = rolesArr.includes('DEMO_ADMIN') || rolesArr.includes('DEMO_USER');
    const isAdmin = rolesArr.includes('DEMO_ADMIN');

    if (!isDemo) return null;

    return (
        <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-amber-800">
            <svg className="w-4 h-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span>
                <strong>Demo Mode</strong> — You are logged in as a{' '}
                <strong>{isAdmin ? 'Demo Admin' : 'Demo User'}</strong>.{' '}
                {isAdmin
                    ? 'You can explore the admin dashboard. Destructive actions are disabled and writes are simulated. Customer data is masked.'
                    : 'You can browse the store and explore all customer features.'}
            </span>
        </div>
    );
}