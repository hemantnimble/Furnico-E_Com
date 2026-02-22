import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { useAppDispatch } from '@/app/lib/store/hooks';
import { addCartItem } from '@/app/lib/store/features/cart/cartSlice';

interface Item {
    id: string;
    price: number;
    title: string;
    images: string[];
    reviews?: { rating: number }[];
}

function Card({ item }: { item: Item }) {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const ratings = item.reviews && item.reviews.length > 0
        ? item.reviews.map(r => r.rating)
        : [];
    const avgRating = ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : "0.0";

    const handleCart = async (productId: string) => {
        setLoading(true);
        try {
            await dispatch(addCartItem(productId));
            toast.success('Product added to cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add product to cart component');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='mb-10 relative'>
            <div className="relative group">
                <button className='h-8 w-8 bg-white rounded-full p-[6px] absolute top-2 right-2'
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCart(item.id);
                    }}>
                    {loading ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 120 30"
                            fill="black"
                            className="h-[15px] w-[15px]"
                        >
                            <circle cx="15" cy="15" r="15">
                                <animate
                                    attributeName="cy"
                                    begin="0s"
                                    dur="0.6s"
                                    values="15;5;15"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                />
                            </circle>
                            <circle cx="60" cy="15" r="15">
                                <animate
                                    attributeName="cy"
                                    begin="0.15s"
                                    dur="0.6s"
                                    values="15;5;15"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                />
                            </circle>
                            <circle cx="105" cy="15" r="15">
                                <animate
                                    attributeName="cy"
                                    begin="0.3s"
                                    dur="0.6s"
                                    values="15;5;15"
                                    calcMode="linear"
                                    repeatCount="indefinite"
                                />
                            </circle>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-black w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    )}
                </button>

                {/* Tooltip */}
                <div className="absolute top-10 right-0 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-xs p-2 rounded-lg">
                    Add to Cart
                </div>
            </div>

            <Link href={`/product/${item.id}`}>
                <div className='bg-[#eaeaea]'>
                    <img className='rounded-lg object-contain w-full h-56 sm:h-72' src={item.images[0]} alt={`${item.title}`} />
                </div>
                <div className='flex justify-between px-2 py-2 items-start'>
                    <span className=''>
                        <h5 className='font-extrabold'>{item.title}</h5>
                        <p className='font-semibold'>₹{item.price}</p>
                    </span>
                    <span className='flex items-center gap-1'>
                        <svg className='w-[16px] h-[16px]' xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 122.88 117.1"><defs><style dangerouslySetInnerHTML={{ __html: ".cls-1{fill:#ffd401;}" }} /></defs><title>star-symbol</title><path className="cls-1" d="M64.42,2,80.13,38.7,120,42.26a3.2,3.2,0,0,1,1.82,5.62h0L91.64,74.18l8.9,39A3.19,3.19,0,0,1,98.12,117a3.27,3.27,0,0,1-2.46-.46L61.41,96.1,27.07,116.64a3.18,3.18,0,0,1-4.38-1.09,3.14,3.14,0,0,1-.37-2.38h0l8.91-39L1.09,47.88a3.24,3.24,0,0,1-.32-4.52,3.32,3.32,0,0,1,2.29-1l39.72-3.56L58.49,2a3.24,3.24,0,0,1,5.93,0Z" /></svg>
                        <p>{avgRating}</p>
                        <span className='text-xs text-gray-400'>({item.reviews?.length || 0})</span>
                    </span>
                </div>
            </Link>
        </div>
    );
}

export default Card;



