'use client'
import React, { useEffect, useState } from 'react'
import CheckoutPage from '@/components/CheckoutPage';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    const [selectedAddress, setSelectedAddress] = useState(null);
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('/api/cart/get');
                const items: CartItem[] = response.data.cartItems; 
                setCartItems(items);
                const total = items.reduce((sum: number, item: CartItem) => {
                    const price = parseFloat(item.product.price);
                    return sum + price * item.quantity;
                }, 0);
                setTotalPrice(total);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCartItems();
    }, []);

    const amount = totalPrice ?? 1;
    const handleSelectAddress = (addressId: any) => {
        setSelectedAddress(addressId);
        console.log("Selected Address ID:", addressId);
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    if (amount === undefined) {
        return <div>Error: Total price not available.</div>;
    }
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {
                            cartItems.map((item, index) => (
                                <div key={item.id} className="space-y-4">
                                    <div className="flex gap-4">
                                        <img className="h-24 w-28 rounded-md border object-cover object-center" src={item.product?.images[0]} alt="" />
                                        <div className='flex flex-col'>
                                            <span>{item.product?.title}</span>
                                            <span>${item.product?.price}</span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${item.product?.price}+tax</span>
                                    </div>
                                </div>
                            ))
                        }

                    </CardContent>
                </Card>
                {/* !Address Section */}
                <AddressSection onSelectAddress={handleSelectAddress} />
                <Card className="mt-6">
                    <div className="p-6">
                        <CardTitle>Payment</CardTitle>
                        <CardDescription>Enter your payment details</CardDescription>
                        <CheckoutPage amount={amount} cartItems={cartItems} selectedAddress={selectedAddress} />
                    </div>
                </Card>
            </div>
        </div>

    )
}
export default Page
