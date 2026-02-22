'use client'
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

function CheckoutPageSingle({
    amount,
    item,
    selectedAddress,
}: {
    amount: number;
    item: any;
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

            await loadRazorpayScript();

            const options = {
                key: process.env.NEXT_PUBLIC_PAYMENT_PUBLIC,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'FurniCo',
                description: item?.title ?? 'Order Payment',
                order_id: razorpayOrder.id,
                prefill: {
                    name: session?.user?.name ?? '',
                    email: session?.user?.email ?? '',
                    contact: '',
                },
                theme: { color: '#111827' },
                handler: async function (response: any) {
                    try {
                        // Step 2: Verify signature
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

                        // Step 3: Create order in DB
                        const orderResponse = await fetch('/api/orders/create', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                paymentIntentId: response.razorpay_payment_id,
                                item,
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
            <Button className="w-full mt-4" disabled={loading}>
                {loading ? 'Processing...' : `Pay ₹${amount}`}
            </Button>
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

export default CheckoutPageSingle;