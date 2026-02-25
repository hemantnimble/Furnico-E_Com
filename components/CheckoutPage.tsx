'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface CartItem {
    id: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    product: Product;
}

interface Product {
    id: string;
    title: string;
    price: string;
}

function CheckoutPage({
    amount,
    cartItems,
    selectedAddress,
}: {
    amount: number;
    cartItems: CartItem[];
    selectedAddress: any;
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            setLoading(false);
            return;
        }

        try {
            const razorpayResponse = await fetch('/api/orders/createrazor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount }),
            });

            if (!razorpayResponse.ok) {
                toast.error('Failed to initiate payment');
                return;
            }

            const { order: razorpayOrder } = await razorpayResponse.json();
            await loadRazorpayScript();

            const options = {
                key: process.env.NEXT_PUBLIC_PAYMENT_PUBLIC,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'Furnico',
                description: 'Order Payment',
                order_id: razorpayOrder.id,
                prefill: {
                    name: session?.user?.name ?? '',
                    email: session?.user?.email ?? '',
                    contact: '',
                },
                theme: { color: '#111827' },
                handler: async function (response: any) {
                    try {
                        const verifyResponse = await fetch('/api/orders/createrazor', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        if (!verifyResponse.ok) {
                            toast.error('Payment verification failed. Contact support.');
                            return;
                        }

                        const orderResponse = await fetch('/api/orders/create', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                paymentIntentId: response.razorpay_payment_id,
                                cartItems,
                                quantity: 1,
                                selectedAddress,
                            }),
                        });

                        if (orderResponse.ok) {
                            toast.success('Order placed successfully!');
                            router.push('/user/orders');
                        } else {
                            toast.error('Order creation failed. Contact support.');
                        }
                    } catch (err) {
                        console.error('Post-payment error:', err);
                        toast.error('Something went wrong. Contact support.');
                    }
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', () => {
                toast.error('Payment failed. Please try again.');
            });
            rzp.open();
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <button
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white text-sm font-semibold py-3.5 hover:bg-gray-700 transition-colors disabled:opacity-60"
            >
                {loading ? (
                    <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Processing...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                        Pay ₹{amount.toLocaleString('en-IN')}
                    </>
                )}
            </button>
        </form>
    );
}

function loadRazorpayScript(): Promise<void> {
    return new Promise((resolve) => {
        if (document.querySelector('script[src*="razorpay"]')) { resolve(); return; }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
}

export default CheckoutPage;