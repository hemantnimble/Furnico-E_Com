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
            // Step 1: Create Razorpay order
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

            // Step 2: Load Razorpay script
            await loadRazorpayScript();

            const options = {
                key: process.env.NEXT_PUBLIC_PAYMENT_PUBLIC,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'FurniCo',
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
                        // Step 3: Verify payment signature server-side
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

                        // Step 4: Create order in DB
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
        <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
            <button
                disabled={loading}
                className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
            >
                {loading ? 'Processing...' : `Pay ₹${amount}`}
            </button>
        </form>
    );
}

function loadRazorpayScript(): Promise<void> {
    return new Promise((resolve) => {
        if (document.querySelector('script[src*="razorpay"]')) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
}

export default CheckoutPage;