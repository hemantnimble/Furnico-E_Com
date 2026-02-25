'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────
interface FAQItem { q: string; a: string; }
interface Section { id: string; label: string; icon: React.ReactNode; }

// ── FAQ data ──────────────────────────────────────────────────────────────────
const faqs: Record<string, FAQItem[]> = {
  orders: [
    { q: 'How do I track my order?', a: 'Once your order is shipped, you will receive an email with a tracking link. You can also visit My Orders in your account to see real-time status updates for every shipment.' },
    { q: 'Can I modify or cancel my order after placing it?', a: 'Orders can be modified or cancelled within 1 hour of placement. After that window, the order enters processing and changes are no longer possible. Please contact our support team immediately if you need to cancel.' },
    { q: 'What happens if my order is delayed?', a: 'In rare cases of delay, we will notify you via email and SMS. If your order exceeds the estimated delivery window by more than 3 business days, you are eligible for a ₹200 store credit applied automatically to your account.' },
    { q: 'Do you offer express delivery?', a: 'Yes. Express delivery (1–2 business days) is available for select pin codes and is shown at checkout. Standard delivery typically takes 5–7 business days across India.' },
  ],
  returns: [
    { q: 'What is your return policy?', a: 'We offer a hassle-free 30-day return window from the date of delivery. Items must be unused, in original packaging, and accompanied by the original invoice. Customised or made-to-order items are not eligible for return.' },
    { q: 'How do I initiate a return?', a: 'Go to My Orders, select the item you wish to return, and click "Return Item". Our logistics partner will schedule a free pickup within 2 business days. Refunds are processed within 7–10 business days after we receive and inspect the item.' },
    { q: 'What if my item arrives damaged?', a: 'We are sorry to hear that. Please take photos of the damage and contact us within 48 hours of delivery via the Help Centre contact form. We will arrange a replacement or full refund at no cost to you — no return pickup required for damaged goods.' },
    { q: 'Are there items that cannot be returned?', a: 'Custom-upholstered furniture, mattresses, gift cards, and clearance items marked "Final Sale" cannot be returned. All other items are eligible under our standard 30-day return policy.' },
  ],
  payments: [
    { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards (Visa, Mastercard, RuPay), UPI (GPay, PhonePe, Paytm), net banking, and EMI options on orders above ₹5,000. Cash on delivery is available for orders under ₹20,000.' },
    { q: 'Is it safe to save my card on Furnico?', a: 'Yes. Furnico uses PCI-DSS compliant payment processors. We never store your full card details on our servers — they are securely tokenised by our payment partner.' },
    { q: 'When will I be charged?', a: 'Your payment is captured at the time of order placement, not at dispatch. For EMI orders, the first instalment is charged at the time of purchase, with subsequent instalments per your bank\'s schedule.' },
    { q: 'How do I get a refund to my original payment method?', a: 'Once we approve your return, refunds are sent back to the original payment method within 7–10 business days. UPI and net banking refunds typically arrive faster (2–4 days). Credit/debit card refunds depend on your bank\'s processing time.' },
  ],
  account: [
    { q: 'How do I change my password?', a: 'Go to Account → Profile → Change Password. You will need to verify your current password before setting a new one. If you have forgotten your password, use the "Forgot Password" link on the sign-in page.' },
    { q: 'Can I have multiple delivery addresses?', a: 'Yes. You can save up to 5 delivery addresses in Account → Saved Addresses. You can select any saved address at checkout or add a new one during the checkout process.' },
    { q: 'How do I delete my account?', a: 'We are sorry to see you go. To permanently delete your account and all associated data, please contact our support team with your registered email address. Account deletion is processed within 14 business days in compliance with data protection regulations.' },
    { q: 'I am not receiving order confirmation emails. What should I do?', a: 'Please check your spam or junk folder first. If the email is not there, ensure the email address on your account is correct under Account → Profile. You can also re-send the confirmation from My Orders.' },
  ],
  privacy: [
    { q: 'What personal data does Furnico collect?', a: 'We collect your name, email address, phone number, delivery addresses, and order history to provide our service. We also collect anonymous browsing data (pages visited, items viewed) to improve your shopping experience.' },
    { q: 'Does Furnico sell my data to third parties?', a: 'Never. We do not sell, rent, or trade your personal information to any third party. We share data only with trusted service providers (payment processors, logistics partners) who are contractually bound to protect it.' },
    { q: 'How long do you keep my data?', a: 'We retain your account data for as long as your account is active, plus 3 years after account closure for legal and tax compliance. Order records are retained for 7 years as required by Indian financial regulations. Anonymous analytics data is purged after 18 months.' },
    { q: 'How can I request a copy of my data?', a: 'Under the Digital Personal Data Protection Act 2023, you have the right to access all data we hold about you. Submit a data access request via the contact form below. We will respond within 30 days.' },
  ],
  shipping: [
    { q: 'Do you ship across India?', a: 'Yes, we deliver to over 19,000 pin codes across India. Some remote locations may have extended delivery timelines of up to 14 business days. Enter your pin code at checkout to see the estimated delivery date for your area.' },
    { q: 'Is delivery free?', a: 'Free standard delivery is available on all orders above ₹2,999. Orders below this threshold carry a flat ₹99 delivery fee. Express delivery is charged at ₹299 regardless of order value.' },
    { q: 'Do you offer assembly services?', a: 'Yes! Our trained assembly teams are available in 35+ cities. Assembly is offered as an add-on during checkout (₹499–₹999 depending on the item). For large furniture items like wardrobes and bed frames, we recommend opting in.' },
    { q: 'What if I am not home at the time of delivery?', a: 'Our logistics partner will attempt delivery twice. If both attempts fail, your order will be held at the nearest hub for 5 days. You can reschedule delivery via the tracking link in your email. After 5 days, the order is returned and a full refund is issued.' },
  ],
};

const sections: Section[] = [
  {
    id: 'orders', label: 'Orders',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  },
  {
    id: 'returns', label: 'Returns & Refunds',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-1.5 4 1.5 4-1.5 4 1.5z" /></svg>,
  },
  {
    id: 'payments', label: 'Payments',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
  },
  {
    id: 'shipping', label: 'Shipping & Delivery',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>,
  },
  {
    id: 'account', label: 'Account & Profile',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  },
  {
    id: 'privacy', label: 'Privacy & Data',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  },
];

// ── FAQ Accordion ─────────────────────────────────────────────────────────────
function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i}
          className={`rounded-2xl border transition-all duration-200 overflow-hidden
            ${open === i ? 'border-gray-300 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
            <span className="text-sm font-semibold text-gray-900">{item.q}</span>
            <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <div className="px-5 pb-5 animate-fadeIn">
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HelpCentrePage() {
  const [activeSection, setActiveSection] = useState('orders');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setContactName(''); setContactEmail(''); setContactMessage('');
    }, 1200);
  };

  const current = sections.find(s => s.id === activeSection)!;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Back + Header ── */}
        <div className="mb-10">
          <Link href="/user/account"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Account
          </Link>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">Support</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Help Centre</h1>
          <p className="text-gray-400 text-sm mt-2">Find answers, policies and support for everything Furnico.</p>
          <div className="mt-5 border-b border-gray-200" />
        </div>

        {/* ── Hero contact strip ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {[
            { icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75', label: 'Email Us', value: 'support@furnico.in', note: 'Replies within 24 hours' },
            { icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z', label: 'Call Us', value: '1800-123-4567', note: 'Mon–Sat, 9 AM – 7 PM' },
            { icon: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z', label: 'Live Chat', value: 'Start a chat', note: 'Available during business hours' },
          ].map(({ icon, label, value, note }) => (
            <div key={label} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              <div>
                <p className="text-[10px] tracking-widest text-gray-400 uppercase">{label}</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
                <p className="text-xs text-gray-400">{note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar nav */}
          <div className="lg:col-span-1">
            <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-3 px-1">Topics</p>
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 text-left
                    ${activeSection === section.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  <span className={activeSection === section.id ? 'text-white' : 'text-gray-400'}>
                    {section.icon}
                  </span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* FAQ panel */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500`}>
                {current.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{current.label}</h2>
            </div>
            <FAQAccordion items={faqs[activeSection]} />
          </div>
        </div>

        {/* ── Privacy Policy ── */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">Legal</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Information We Collect', body: 'We collect information you provide directly — name, email, phone, delivery address, and payment details — as well as data generated through your use of our platform, including browsing history, search queries, and order records. Device and usage data such as IP addresses, browser type, and cookies are collected automatically.' },
              { title: 'How We Use Your Data', body: 'Your data is used to process and fulfil orders, personalise your shopping experience, send transactional communications (order confirmations, shipping updates), improve our platform, and comply with legal obligations. We do not use your data for unsolicited marketing without your explicit consent.' },
              { title: 'Data Sharing', body: 'We share your information only with: (1) payment processors to handle transactions securely, (2) logistics partners to fulfil deliveries, and (3) technology providers who operate our platform under strict data processing agreements. We never sell your personal data to advertisers or data brokers.' },
              { title: 'Your Rights', body: 'Under the Digital Personal Data Protection Act 2023, you have the right to access, correct, and erase your personal data. You may also withdraw consent for data processing at any time. To exercise any of these rights, contact us at privacy@furnico.in. We will respond within 30 days.' },
              { title: 'Cookies', body: 'We use essential cookies (required for the site to function), performance cookies (to understand how visitors use our site), and preference cookies (to remember your settings). You can manage cookie preferences via your browser settings. Disabling cookies may affect site functionality.' },
              { title: 'Data Retention & Security', body: 'We retain your data for as long as necessary to provide our services and comply with legal obligations. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We conduct regular security audits and maintain an incident response plan to handle any potential data breaches promptly.' },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-6">Last updated: 1 January 2025 · For queries, email <span className="text-gray-600 font-medium">privacy@furnico.in</span></p>
        </div>

        {/* ── Terms of Service ── */}
        <div className="mt-14 border-t border-gray-200 pt-12">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">Legal</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms of Service</h2>
          <div className="space-y-4">
            {[
              { title: '1. Acceptance of Terms', body: 'By accessing or using Furnico ("the Platform"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please discontinue use immediately. These terms apply to all visitors, users, and customers of the Platform.' },
              { title: '2. Account Responsibility', body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately at support@furnico.in if you suspect unauthorised access. Furnico is not liable for losses caused by unauthorised use of your account.' },
              { title: '3. Product Listings & Pricing', body: 'We make every effort to ensure product descriptions and prices are accurate. However, errors may occur. Furnico reserves the right to cancel any order placed at an incorrect price and will issue a full refund. Images are for illustration purposes; actual product may vary slightly due to photographic lighting.' },
              { title: '4. Intellectual Property', body: 'All content on this Platform — including text, images, logos, and product designs — is the property of Furnico or its content suppliers and is protected by Indian and international copyright laws. You may not reproduce, distribute, or create derivative works without our prior written consent.' },
              { title: '5. Limitation of Liability', body: 'To the maximum extent permitted by law, Furnico shall not be liable for indirect, incidental, or consequential damages arising from your use of the Platform. Our total liability for any claim shall not exceed the amount you paid for the specific product or service giving rise to the claim.' },
              { title: '6. Governing Law', body: 'These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra. Furnico encourages resolution through our customer support team before initiating legal proceedings.' },
            ].map(({ title, body }) => (
              <div key={title} className="border-b border-gray-100 pb-4 last:border-0">
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-6">Last updated: 1 January 2025 · Effective immediately upon acceptance.</p>
        </div>

        {/* ── Contact form ── */}
        <div className="mt-14 border-t border-gray-200 pt-12">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">Still need help?</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h2>
          <p className="text-sm text-gray-400 mb-7">Our team typically responds within 24 business hours.</p>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4 rounded-2xl bg-green-50 border border-green-100 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">Message sent!</p>
                <p className="text-sm text-gray-500 mt-1">We will get back to you within 24 hours.</p>
              </div>
              <button onClick={() => setSent(false)}
                className="text-sm text-gray-500 underline hover:text-gray-800 transition-colors">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContact} className="max-w-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                  <input
                    value={contactName} onChange={e => setContactName(e.target.value)}
                    placeholder="John Doe" required
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                    placeholder="you@email.com" required
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">How can we help?</label>
                <textarea
                  value={contactMessage} onChange={e => setContactMessage(e.target.value)}
                  placeholder="Describe your issue in as much detail as possible..."
                  required rows={5}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="flex items-center gap-2 rounded-full bg-gray-900 text-white text-sm font-semibold px-7 py-3 hover:bg-gray-700 transition-colors disabled:opacity-60">
                {sending ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>

      <style>{`
        @keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fadeIn     { animation: fadeIn 0.2s ease both }
        .animate-fadeInUp   { animation: fadeInUp 0.3s ease both }
      `}</style>
    </div>
  );
}