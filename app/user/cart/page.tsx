'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import CartLoading from '@/components/CartLoading';
import WordPullUp from "@/components/magicui/word-pull-up";
import { useAppDispatch, useAppSelector } from '@/app/lib/store/hooks';
import { fetchCartItems, removeCartItem, updateCartItem } from '../../lib/store/features/cart/cartSlice';

interface Product {
    id: string;
    title: string;
    price: number;
    images: string[];
}

interface CartItem {
    id: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    product: Product;
}

export default function CartPage() {
    const dispatch = useAppDispatch();
    const { cartItems, status } = useAppSelector((state) => state.cart);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCartItems());
        }
    }, [dispatch, status]);

    // Calculate total price whenever cartItems change
    useEffect(() => {
        const total = cartItems.reduce((sum, item) => {
            const price = typeof item.product?.price === 'string' ? parseFloat(item.product.price) : (item.product?.price || 0);
            return sum + price * item.quantity;
        }, 0);
        setTotalPrice(total);
    }, [cartItems]);

    // Handle delete item
    async function handleDelete(cartItemId: string) { // Use cartItemId instead of productId
        try {
            await dispatch(removeCartItem(cartItemId)).unwrap(); // Pass cartItemId
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Error deleting item');
        }
    }

    // Handle quantity update
    const handleQuantityChange = async (productId: string, increment: boolean) => {
        const item = cartItems.find((item) => item.product.id === productId);
        if (!item) return;

        const newQuantity = increment ? item.quantity + 1 : Math.max(item.quantity - 1, 1);

        try {
            await dispatch(updateCartItem({ id: item.id, quantity: newQuantity })).unwrap(); // Dispatch Redux action
            toast.success('Quantity updated');
        } catch (error) {
            toast.error('Error updating quantity');
        }
    };

    if (status === 'loading' || status === 'idle') {
        return (
            <div className='flex items-center justify-center w-full h-[100vh] flex-col'>
                <img className='w-[30%]' src='/assets/cart.gif' alt="cart gif" />
                <WordPullUp
                    className="text-lg font-bold tracking-[-0.02em] text-black dark:text-white md:text-7xl md:leading-[5rem]"
                    words="Loading your cart..."
                />
            </div>
        );
    }

    if (status === 'succeeded' && (!cartItems || cartItems.length === 0)) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <h2 className="text-lg font-semibold text-gray-900">Your cart is empty.</h2>
                <Link href="/" className="mt-4 text-gray-600 hover:underline">
                    Go back to shopping
                </Link>
            </div>
        );
    }

    // Ensure all cart items have a product object
    if (cartItems.some(item => !item.product)) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <h2 className="text-lg font-semibold text-gray-900">Some items in your cart are invalid.</h2>
                <Link href="/" className="mt-4 text-gray-600 hover:underline">
                    Go back to shopping
                </Link>
            </div>
        );
    }
    return (
        <div className="mx-auto mt-8 max-w-2xl md:mt-12">
            <div className="shadow px-4">
                <div className="px-4 py-6 sm:px-8 sm:py-10">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <h2 className="text-lg font-semibold text-gray-900">Your cart is empty.</h2>
                            <Link href="/" className="mt-4 text-gray-600 hover:underline">
                                Go back to shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="flow-root">
                            <ul className="-my-8">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0">
                                        <div className="shrink-0">
                                            <img className="h-24 w-24 max-w-full rounded-lg object-cover" src={item.product?.images[0]} alt="" />
                                        </div>
                                        <div className="relative flex flex-1 flex-col justify-between">
                                            <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                                                <div className="pr-8 sm:pr-5">
                                                    <p className="text-base font-semibold text-gray-900">{item.product?.title}</p>
                                                    <p className="mx-0 mt-1 mb-0 text-sm text-gray-400">36EU - 4US</p>
                                                </div>
                                                <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                                                    <p className="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">₹{item.product.price}</p>
                                                    <div className="sm:order-1">
                                                        <div className="mx-auto flex h-8 items-stretch text-gray-600">
                                                            <button onClick={() => handleQuantityChange(item.product?.id, false)} className="flex items-center justify-center rounded-l-md bg-gray-200 px-4 transition hover:bg-black hover:text-white">-</button>
                                                            <div className="flex w-full items-center justify-center bg-gray-100 px-4 text-xs uppercase transition">{item.quantity}</div>
                                                            <button onClick={() => handleQuantityChange(item.product?.id, true)} className="flex items-center justify-center rounded-r-md bg-gray-200 px-4 transition hover:bg-black hover:text-white">+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto">
                                                <button onClick={() => handleDelete(item?.id)} type="button" className="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900">
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {cartItems.length > 0 && (
                        <>
                            <div className="mt-6 border-t border-b py-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-400">Subtotal</p>
                                    <p className="text-lg font-semibold text-gray-900">₹{totalPrice.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-400">Shipping</p>
                                    <p className="text-lg font-semibold text-gray-900">₹8.00</p>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">Total</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    <span className="text-xs font-normal text-gray-400">INR</span> ₹{(totalPrice + 8).toFixed(2)}
                                </p>
                            </div>
                            <div className="mt-6 text-center">
                                <Link href={`/user/checkout`}>
                                    <button type="button" className="group inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
                                        Checkout
                                        <svg xmlns="http://www.w3.org/2000/svg" className="group-hover:ml-8 ml-4 h-6 w-6 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}