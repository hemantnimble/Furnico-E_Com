'use client';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const AccountPage: React.FC = () => {
  const { data: session } = useSession();

  const handleSignout = () => {
    try {
      signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const menuItems = [
    {
      href: '/user/orders',
      label: 'My Orders',
      description: 'Track, return or buy again',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      href: '/user/account/profile',
      label: 'Profile',
      description: 'Manage your personal details',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
    {
      href: '/user/address',
      label: 'Saved Addresses',
      description: 'Manage delivery addresses',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
    },
    {
      href: '/user/help',
      label: 'Help Center',
      description: 'Get support for your orders',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">My Account</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Account</h1>
          <div className="mt-4 border-b border-gray-200" />
        </div>

        {/* ── User card ── */}
        <div className="flex items-center gap-5 bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-8">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold shrink-0 select-none">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-0.5">Welcome back</p>
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {session?.user?.name || 'Guest'}
            </h2>
            {session?.user?.email && (
              <p className="text-sm text-gray-400 truncate">{session.user.email}</p>
            )}
          </div>
        </div>

        {/* ── Menu items ── */}
        <div className="flex flex-col gap-3 mb-8">
          {menuItems.map(({ href, label, description, icon }) => (
            <Link key={label} href={href}>
              <div className="group flex items-center gap-4 px-5 py-4 rounded-2xl border border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-gray-900 group-hover:text-white text-gray-500 flex items-center justify-center shrink-0 transition-colors duration-200">
                  {icon}
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                </div>
                {/* Arrow */}
                <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Sign out ── */}
        <div className="border-t border-gray-100 pt-6">
          <button
            onClick={handleSignout}
            className="w-full flex items-center justify-center gap-2.5 rounded-full border border-gray-200 py-3 text-sm font-medium text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
};

export default AccountPage;