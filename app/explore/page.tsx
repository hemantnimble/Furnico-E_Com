'use client'
import AllProducts from '@/components/AllProducts'
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/app/lib/store/hooks';
import { addCartItem } from '@/app/lib/store/features/cart/cartSlice';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

interface Product {
    id: string;
    title: string;
    price: string;
    category: string;
    images: string[],
    createdAt: string;
    updatedAt: string;
}
function Explore() {
    const dispatch = useAppDispatch();
    const [ploading, setPLoading] = useState(false);
    const [loading, setLoading] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState("All");
    const [activeCategory, setActiveCategory] = useState<string>('All');
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.post<{ products: Product[] }>("/api/products/filter", { category })
                setProducts(response.data.products)
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                setPLoading(false);
            }
        }

        fetchProducts();
    }, [])

    function handleCategory(category: string) {
        setActiveCategory(category)
        setCategory(category)
    }

    const handleCart = async (productId: string, e: any) => {
        e.preventDefault();
        setLoading(productId);
        try {
            await dispatch(addCartItem(productId)).unwrap();
            toast.success('Product added to cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add product to cart');
        } finally {
            setLoading(null);
        }
    }

    const SkeletonCard = () => (
        <article className="rounded-xl shadow-lg p-4 animate-pulse">
            <div className="relative flex items-end overflow-hidden rounded-xl bg-slate-200 h-56 md:h-72 w-full"></div>

            <div className="mt-1 p-2 space-y-4">
                {/* Title skeleton */}
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>

                <div className="flex justify-between items-end">
                    <div className="flex flex-col space-y-2">
                        {/* Price skeleton */}
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                    </div>

                    {/* Button skeleton */}
                    <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                </div>
            </div>
        </article>
    );
    return (
        <>
            {/* filter */}
            <div className="max-w-screen-md">
                <div className="bg-white py-2 px-3">
                    <nav className="flex flex-wrap gap-4">
                        {['All', 'table', 'chair', 'lamp', 'sofa'].map((category) => (
                            <span
                                key={category}
                                onClick={() => handleCategory(category)} // Set active category on click
                                className={`whitespace-nowrap inline-flex rounded-lg py-2 px-3 text-sm font-medium transition-all duration-200 ease-in-out ${activeCategory === category
                                    ? 'bg-gray-200 text-gray-900' // Active state styles
                                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    }`}
                            >
                                {category}
                            </span>
                        ))}
                    </nav>
                </div>
            </div>
            <div className='mx-3'>
                <AllProducts category={category} />
            </div>
            {/* content */}
            <div>
                <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
                <style dangerouslySetInnerHTML={{ __html: "\n  :root {\n    font-family: 'Poppins'\n  }\n" }} />
                <div className="my-10 mx-auto flex w-screen max-w-screen-lg flex-col rounded-3xl bg-green-50 px-4">
                    <p className="mt-20 text-center sm:text-lg font-semibold text-lime-500">HavenCraft Furniture</p>
                    <h1 className="mx-auto mt-2 max-w-3xl text-center text-2xl font-semibold leading-tight sm:text-4xl md:text-5xl">Discover a world of beautifully crafted furniture designed to make your home unique.</h1>
                    <p className="mx-auto hidden sm:block mt-4 max-w-5xl text-center text-gray-500 sm:mt-8 sm:text-lg"> From sleek, modern designs to classic, timeless pieces, we offer an extensive range of high-quality furniture to suit every style and need.</p>
                    <div className="mx-auto mt-8 mb-20 flex w-full flex-col space-y-2 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-6">
                        <button className="rounded-full bg-black px-10 py-3 font-medium text-white hover:opacity-80 sm:w-auto">Shop Now</button>
                        <button className="rounded-full border-2 border-black px-10 py-3 font-medium text-black transition hover:bg-black hover:text-white sm:w-auto">View All</button>
                    </div>
                </div>
            </div>
            {/* best selling items */}
            <section className="py-4">
                <div className="max-w-md mx-3 mb-4">
                    <h2 className="text-2xl font-bold sm:text-3xl">Our Best Selling Products.</h2>
                    <p className="mt-4 text-base text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus faucibus massa dignissim tempus.</p>
                </div>
                <div className="mx-3 grid max-w-screen-xl grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {ploading ? (
                        Array.from({ length: 2 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))
                    ) : (
                        products.length > 0 ? (
                            products.map((item: Product) => (
                                <Link href={`/product/${item.id}`} key={item.id}>
                                    <article className="rounded-xl shadow-lg hover:shadow-xl">
                                        <div className="relative flex items-end overflow-hidden rounded-xl bg-slate-200">
                                            <img className='object-contain h-56 md:h-72 w-full' src={item.images[0]} alt="Photo" />
                                            <div className="absolute bottom-3 right-3 inline-flex items-center rounded-lg bg-white p-2 shadow-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-slate-400 ml-1 text-sm">4.9</span>
                                            </div>
                                        </div>
                                        <div className="mt-1 p-2 ">
                                            <h2 className="text-slate-700">{item.title}</h2>
                                            <div className="mt-3 flex items-end justify-between">
                                                <p>
                                                    <span className="text-lg font-bold text-blue-500">₹{item.price}</span>
                                                    {/* <span className="text-slate-400 text-sm">/night</span> */}
                                                </p>
                                                <button type='button' className="group inline-flex rounded-xl bg-blue-100 p-2 hover:bg-blue-200" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCart(item.id, e);
                                                }}>
                                                    {loading === item.id ? (
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
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="group-hover:text-blue-500 h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))
                        ) : (
                            <p>No products found</p>
                        )
                    )}
                </div>
            </section>
        </>
    )
}

export default Explore