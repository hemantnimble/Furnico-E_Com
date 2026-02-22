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

type Inputs = {
    title: string
    price: number
    category: string
    stock: number
}

function AddProduct() {
    const dispatch = useAppDispatch();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Inputs>();

    const [images, setImages] = useState<{ url: string; key: string }[]>([]);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const productData = {
                ...data,
                price: Number(data.price),
                stock: Number(data.stock),
                images: images.map(img => img.url),
            };

            await dispatch(addProduct(productData)).unwrap();
            toast.success('Product added successfully!');
            reset();
            setImages([]);
        } catch (error) {
            console.error('Add product error:', error);
            toast.error('Failed to add product. Please try again.');
        }
    };

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new product</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
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
                    </div>

                    <section className="flex flex-col items-center justify-start pt-4">
                        <UploadButton<OurFileRouter, "imageUploader">
                            endpoint="imageUploader"
                            onClientUploadComplete={(res: any) => {
                                if (res) setImages(res);
                                toast.success('Images uploaded!');
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`Upload failed: ${error.message}`);
                            }}
                        />
                        {images.length > 0 && (
                            <ul className="mt-2 flex gap-2 flex-wrap">
                                {images.map(img => (
                                    <li key={img.key}>
                                        <img src={img.url} alt="preview" className="w-20 h-20 object-cover rounded" />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 flex w-full justify-center rounded-md bg-cyan-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Adding...' : 'Add Product'}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default AddProduct;