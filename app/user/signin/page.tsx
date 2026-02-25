import SignIn from '@/components/SignIn'
import React from 'react'

function page() {
  return (
    <div className="min-h-screen bg-white flex">

      {/* ── Left panel — decorative ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-950 flex-col justify-between p-14">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />

        {/* Large decorative number */}
        <div className="absolute right-0 bottom-0 text-[28rem] font-black text-white opacity-[0.03] leading-none select-none pointer-events-none"
          style={{ fontVariantNumeric: 'tabular-nums' }}>
          F
        </div>

        {/* Logo / brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Furnico</span>
          </div>
        </div>

        {/* Middle quote */}
        <div className="relative z-10 space-y-6">
          <p className="text-white text-3xl font-bold leading-snug tracking-tight max-w-xs">
            Furniture that<br />
            <span className="text-gray-400">fits your life.</span>
          </p>
          <div className="flex gap-2">
            {[0,1,2].map(i => (
              <div key={i} className={`h-0.5 rounded-full ${i === 0 ? 'w-8 bg-white' : 'w-4 bg-gray-700'}`} />
            ))}
          </div>
        </div>

        {/* Bottom trust row */}
        <div className="relative z-10 flex gap-8">
          {[
            { n: '10K+', label: 'Happy customers' },
            { n: '500+', label: 'Products' },
            { n: '4.9', label: 'Average rating' },
          ].map(({ n, label }) => (
            <div key={label}>
              <p className="text-white font-bold text-xl">{n}</p>
              <p className="text-gray-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28">
        <div className="w-full max-w-sm mx-auto">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">Furnico</span>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">Welcome back</p>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sign in</h1>
          </div>

          {/* The actual form component */}
          <SignIn />

          {/* Footer */}
          <p className="mt-10 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Furnico. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default page