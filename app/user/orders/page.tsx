'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  price: string;
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  status: string;
}

const statusStyles: Record<string, { dot: string; text: string; bg: string }> = {
  DELIVERED:  { dot: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50'  },
  SHIPPED:    { dot: 'bg-blue-500',   text: 'text-blue-700',   bg: 'bg-blue-50'   },
  PROCESSING: { dot: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50' },
  CANCELLED:  { dot: 'bg-red-400',    text: 'text-red-600',    bg: 'bg-red-50'    },
  PENDING:    { dot: 'bg-gray-400',   text: 'text-gray-600',   bg: 'bg-gray-100'  },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusStyles[status?.toUpperCase()] || statusStyles.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/orders/get')
      .then(r => setOrders(r.data.orders))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4">
          <div className="h-8 w-40 bg-gray-100 rounded-lg animate-pulse" />
          {[0,1,2].map(i => (
            <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" style={{ animationDelay: `${i*0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ── */}
        <div className="mb-8">
          <Link href="/user/account"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Account
          </Link>
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">History</p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Orders</h1>
            {orders.length > 0 && (
              <span className="text-sm text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            )}
          </div>
          <div className="mt-4 border-b border-gray-200" />
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-sm text-red-600 mb-6">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Empty ── */}
        {!error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">No orders yet</p>
              <p className="text-sm text-gray-400 mt-1">Your order history will appear here.</p>
            </div>
            <Link href="/"
              className="rounded-full bg-gray-900 text-white text-sm font-medium px-6 py-2.5 hover:bg-gray-700 transition-colors">
              Start Shopping
            </Link>
          </div>
        )}

        {/* ── Orders list ── */}
        {orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order, i) => {
              const total = order.items.reduce(
                (sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0
              );
              const isOpen = expanded === order.id;
              const shortId = order.id.slice(0, 8).toUpperCase();

              return (
                <div
                  key={order.id}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-200 animate-fadeInUp"
                >
                  {/* Row header — click to expand */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left bg-white"
                  >
                    {/* Order icon */}
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">#{shortId}</p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                        {' · '}
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>

                    {/* Chevron */}
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded items */}
                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 space-y-3 animate-fadeIn">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                              {item.quantity}
                            </span>
                            <span className="text-gray-700 truncate">{item.product.title}</span>
                          </div>
                          <span className="text-gray-900 font-medium shrink-0">
                            ₹{(parseFloat(item.product.price) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                        <span className="text-xs text-gray-400">Order total</span>
                        <span className="text-sm font-bold text-gray-900">
                          ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeInUp  { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fadeIn      { animation: fadeIn 0.2s ease both }
        .animate-fadeInUp    { animation: fadeInUp 0.3s ease both }
      `}</style>
    </div>
  );
};

export default Orders;