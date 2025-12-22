"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronLeft,
    Edit3,
    Trash2,
    Package,
    Calendar,
    Tag,
    Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// fetch Data
const fetchProduct = async (id) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default function AdminProductDetailPage({ params }) {
    const { id } = use(params);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!id) return;

        fetchProduct(id).then((data) => {
            if (data) {
                const productData = Array.isArray(data) ? data[0] : data;
                setProduct(productData);

                if (productData.colors && productData.colors.length > 0) {
                    setSelectedColor(productData.colors[0]);
                }
            }
            setLoading(false);
        });
    }, [id]);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 dark:text-zinc-400 font-medium">Loading Product Data...</p>
                </div>
            </div>
        );
    }

    // Error State 
    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 text-center p-4 transition-colors duration-300">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 max-w-md w-full">
                    <Package className="w-16 h-16 text-gray-300 dark:text-zinc-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
                    <p className="text-gray-500 dark:text-zinc-400 mb-6">The product you are looking for does not exist or has been removed.</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors w-full"
                    >
                        Return to Inventory
                    </Link>
                </div>
            </div>
        );
    }

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
        >
            <div className="max-w-6xl mx-auto">

                {/* --- Header --- */}
                <motion.nav variants={itemVariants} className="flex items-center justify-between mb-8">
                    <div className="flex items-center text-sm text-gray-500 dark:text-zinc-400">
                        <Link href="/products" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center transition-colors font-medium">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Inventory
                        </Link>
                        <span className="mx-2 text-gray-300 dark:text-zinc-700">/</span>
                        <span className="text-gray-900 dark:text-white font-semibold truncate max-w-[200px]">{product.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase rounded-full tracking-wide border border-green-200 dark:border-green-900">
                            Active
                        </span>
                        <span className="text-xs text-gray-400 dark:text-zinc-500 font-mono">ID: {product.id}</span>
                    </div>
                </motion.nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- LEFT COLUMN: Images & Metadata --- */}
                    <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-6">

                        {/* Image Preview */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-2 relative overflow-hidden group transition-colors duration-300">
                            <div className="relative aspect-square w-full bg-gray-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden">
                                {product.images && selectedColor ? (
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={selectedColor}
                                            initial={{ opacity: 0, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full relative"
                                        >
                                            <Image
                                                src={product.images[selectedColor]}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-8"
                                                priority
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300 dark:text-zinc-600">
                                        <Package className="w-16 h-16" />
                                    </div>
                                )}
                            </div>

                            {/* Color Switcher */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100 dark:border-zinc-700 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                {product.colors?.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-6 h-6 rounded-full border border-gray-200 dark:border-zinc-600 shadow-inner transition-transform ${selectedColor === color ? "scale-125 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-800" : "hover:scale-110"
                                            }`}
                                        style={{ backgroundColor: color }}
                                        title={`View ${color} variant`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 transition-colors duration-300">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Layers className="w-4 h-4 mr-2 text-indigo-500" />
                                Technical Metadata
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-zinc-400 flex items-center">
                                        <Calendar className="w-3.5 h-3.5 mr-2" /> Created
                                    </span>
                                    <span className="font-mono text-gray-700 dark:text-zinc-300">
                                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-zinc-400 flex items-center">
                                        <Calendar className="w-3.5 h-3.5 mr-2" /> Updated
                                    </span>
                                    <span className="font-mono text-gray-700 dark:text-zinc-300">
                                        {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- RIGHT COLUMN: Details --- */}
                    <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8 lg:p-10 flex-1 transition-colors duration-300">

                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Tag className="w-4 h-4 text-indigo-500" />
                                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                            {product.categorySlug}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{product.name}</h1>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</p>
                                </div>
                            </div>

                            <div className="prose prose-sm text-gray-500 dark:text-zinc-400 mb-8 max-w-none">
                                <p>{product.description}</p>
                            </div>

                            {/* Data Grids */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                {/* Colors Grid */}
                                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-gray-100 dark:border-zinc-800 transition-colors">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide block mb-3">
                                        Available Colors ({product.colors?.length})
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors?.map((color) => (
                                            <div key={color} className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm">
                                                <span className="w-3 h-3 rounded-full border border-black/10 dark:border-white/10" style={{ backgroundColor: color }} />
                                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 capitalize">{color}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sizes Grid */}
                                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-gray-100 dark:border-zinc-800 transition-colors">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide block mb-3">
                                        Available Sizes ({product.sizes?.length})
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes?.map((size) => (
                                            <span key={size} className="px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-mono font-medium text-gray-700 dark:text-zinc-300 shadow-sm uppercase">
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}