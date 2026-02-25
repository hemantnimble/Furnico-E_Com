'use client'
import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import "@uploadthing/react/styles.css";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import Link from "next/link";
import { useAppDispatch } from '@/app/lib/store/hooks';
import { addProduct } from '@/app/lib/store/features/products/productSlice';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import DemoBanner from '@/components/DemoBanner';

type Inputs = {
    title: string
    price: number
    category: string
    stock: number
    description: string
}

function AddProduct() {
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Inputs>();

    const [images, setImages] = useState<{ url: string; key: string }[]>([]);
    const [model3d, setModel3d] = useState<{ url: string; key: string; name: string } | null>(null);

    // ── Demo guard ────────────────────────────────────────────────────────
    const role = session?.user?.roles as unknown as string | string[] | undefined;
    const rolesArr = Array.isArray(role) ? role : role ? [role] : [];
    const isDemoAdmin = rolesArr.includes('DEMO_ADMIN');

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        // Fake success for demo admin — no DB write
        if (isDemoAdmin) {
            await new Promise((r) => setTimeout(r, 800));
            toast.success('Product added! (demo — no DB change)');
            reset();
            setImages([]);
            setModel3d(null);
            return;
        }

        try {
            const productData = {
                ...data,
                price: Number(data.price),
                stock: Number(data.stock),
                images: images.map(img => img.url),
                model3dUrl: model3d?.url ?? null,
            };

            await dispatch(addProduct(productData)).unwrap();
            toast.success('Product added successfully!');
            reset();
            setImages([]);
            setModel3d(null);
        } catch (error) {
            console.error('Add product error:', error);
            toast.error('Failed to add product. Please try again.');
        }
    };

    return (
        <section className="bg-white dark:bg-gray-900">
            <DemoBanner />
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new product</h2>

                {isDemoAdmin && (
                    <div className="mb-5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                        🔒 Demo mode — form is fully interactive but submit will not save to the database.
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">

                        {/* ── Title ── */}
                        <div className="sm:col-span-2">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Product Name
                            </label>
                            <input
                                {...register("title", { required: 'Title is required' })}
                                type="text"
                                id="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Type product name"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        {/* ── Stock ── */}
                        <div className="w-full">
                            <label htmlFor="stock" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Stock
                            </label>
                            <input
                                {...register("stock", { required: 'Stock is required', min: { value: 0, message: 'Stock cannot be negative' } })}
                                type="number"
                                id="stock"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="0"
                            />
                            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                        </div>

                        {/* ── Price ── */}
                        <div className="w-full">
                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Price (₹)
                            </label>
                            <input
                                {...register("price", { required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } })}
                                type="number"
                                id="price"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="2999"
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                        </div>

                        {/* ── Category ── */}
                        <div className="sm:col-span-2">
                            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Product Category
                            </label>
                            <input
                                {...register("category", { required: 'Category is required' })}
                                type="text"
                                id="category"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                placeholder="e.g. chair, table, lamp"
                            />
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>

                        {/* ── Description ── */}
                        <div className="sm:col-span-2">
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Description
                            </label>
                            <textarea
                                {...register("description", { required: 'Description is required' })}
                                id="description"
                                rows={4}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white resize-none"
                                placeholder="Describe the product — materials, style, dimensions..."
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>
                    </div>

                    {/* ── Product Images ── */}
                    <div className="mt-6">
                        <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Images</p>
                        <div className="flex flex-col items-start gap-3 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                            {isDemoAdmin ? (
                                <p className="w-full text-center text-xs text-gray-400 py-2">Image upload disabled in demo mode</p>
                            ) : (
                                <UploadButton<OurFileRouter, "imageUploader">
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res: any) => {
                                        if (res) setImages(res);
                                        toast.success('Images uploaded!');
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast.error(`Image upload failed: ${error.message}`);
                                    }}
                                />
                            )}
                            {images.length > 0 && (
                                <ul className="flex gap-2 flex-wrap mt-1">
                                    {images.map(img => (
                                        <li key={img.key}>
                                            <img src={img.url} alt="preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* ── 3D Model Upload ── */}
                    <div className="mt-6">
                        <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            3D Model{' '}
                            <span className="text-gray-400 font-normal text-xs">(.glb or .gltf — optional, max 50 MB)</span>
                        </p>
                        <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                            {isDemoAdmin ? (
                                <p className="w-full text-center text-xs text-gray-400 py-2">3D model upload disabled in demo mode</p>
                            ) : !model3d ? (
                                <UploadButton<OurFileRouter, "model3dUploader">
                                    endpoint="model3dUploader"
                                    onClientUploadComplete={(res: any) => {
                                        if (res && res[0]) {
                                            setModel3d({ url: res[0].url, key: res[0].key, name: res[0].name });
                                            toast.success('3D model uploaded!');
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast.error(`3D model upload failed: ${error.message}`);
                                    }}
                                />
                            ) : (
                                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-green-800 truncate">{model3d.name}</p>
                                        <p className="text-xs text-green-600 mt-0.5">Uploaded — will show in 3D viewer ✓</p>
                                    </div>
                                    <button type="button" onClick={() => setModel3d(null)}
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-green-500 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            <p className="mt-3 text-xs text-gray-400">
                                Export a <strong>.glb</strong> file from Blender, Sketchfab, or any 3D tool and upload it here.
                                It will appear in the interactive 3D viewer on the product page.
                                Leave empty to use the default generic furniture model.
                            </p>
                        </div>
                    </div>

                    {/* ── Submit ── */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 flex w-full justify-center items-center gap-2 rounded-md bg-cyan-700 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Adding...
                            </>
                        ) : 'Add Product'}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default AddProduct;