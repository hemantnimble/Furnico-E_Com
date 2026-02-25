'use client'
import React, { useEffect, useState } from 'react'
import CheckoutPage from '@/components/CheckoutPage';
import axios from 'axios';
import AddressSection from '@/components/AddressSection';

interface Product {
    id: string;
    title: string;
    price: string;
    images: string[];
}

interface CartItem {
    id: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    product: Product;
}

function Page() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('/api/cart/get');
                const items: CartItem[] = response.data.cartItems;
                setCartItems(items);
                const total = items.reduce((sum: number, item: CartItem) => {
                    return sum + parseFloat(item.product.price) * item.quantity;
                }, 0);
                setTotalPrice(total);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCartItems();
    }, []);

    const shipping = Math.round(totalPrice * 0.1);
    const grandTotal = totalPrice + shipping;

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                        <span key={i} className="w-2.5 h-2.5 rounded-full bg-gray-800 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

                {/* ── Header ── */}
                <div className="mb-10">
                    <p className="text-xs tracking-widest text-gray-400 uppercase mb-1">Almost there</p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Checkout</h1>
                    <div className="mt-4 border-b border-gray-200" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">

                    {/* ── Left: Address + Payment ── */}
                    <div className="space-y-10">

                        {/* Address */}
                        <div>
                            <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">Step 1 — Delivery Address</p>
                            <AddressSection onSelectAddress={setSelectedAddress} />
                        </div>

                        {/* Payment */}
                        <div>
                            <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">Step 2 — Payment</p>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
                                        <p className="text-xs text-gray-400">Powered by Razorpay</p>
                                    </div>
                                </div>
                                <CheckoutPage
                                    amount={grandTotal}
                                    cartItems={cartItems}
                                    selectedAddress={selectedAddress}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Order Summary ── */}
                    <div className="lg:sticky lg:top-24">
                        <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">Order Summary</p>
                        <div className="rounded-2xl border border-gray-100 overflow-hidden">

                            {/* Items */}
                            <div className="divide-y divide-gray-100">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                            <img
                                                src={item.product?.images[0]}
                                                alt={item.product?.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.product?.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                ₹{Number(item.product?.price).toLocaleString('en-IN')} × {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 shrink-0">
                                            ₹{(parseFloat(item.product.price) * item.quantity).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="bg-gray-50 px-5 py-4 space-y-3">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-800">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Delivery (10%)</span>
                                    <span className="font-medium text-gray-800">₹{shipping.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-extrabold text-gray-900">
                                        ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-5 flex items-center justify-center gap-6">
                            {[
                                { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Secure Checkout' },
                                { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', label: 'Encrypted Payment' },
                                { icon: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-1.5 4 1.5 4-1.5 4 1.5z', label: 'Free Returns' },
                            ].map(({ icon, label }) => (
                                <div key={label} className="flex flex-col items-center gap-1.5 text-[11px] text-gray-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                                    </svg>
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;