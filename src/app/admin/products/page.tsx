/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Edit2, Trash2,
    Layers, Zap, Filter,
    Scan, Cpu, Globe, ArrowUpRight
} from 'lucide-react';
import Background from '@/components/Background';
import Link from 'next/link';
import { useProductStore } from '@/app/store/useProductStore';
import PageHeader from '@/components/PageHeader';

const ProductManager: React.FC = () => {
    const { products, loading, fetchProducts, deleteProduct } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'ALL' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const totalTonValue = products.reduce((sum, p) => sum + p.priceTon, 0);

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans overflow-x-hidden relative pb-40 selection:bg-cyan-500/30">
            <Background />

            <PageHeader title="Product Manager" />

            <main className="relative z-10 pt-28 px-4 space-y-8">

                {/* --- 2. THE PRISM CARD (Stats) --- */}
                <section className="relative w-full aspect-[2/1] group perspective-1000">
                    <motion.div
                        initial={{ rotateX: 10, opacity: 0 }}
                        animate={{ rotateX: 0, opacity: 1 }}
                        transition={{ duration: 1, type: "spring" }}
                        className="relative w-full h-full bg-[#080808] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl"
                    >
                        {/* 2A. Background FX */}
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full" />
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full" />
                        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                        {/* 2B. Holographic Border */}
                        <div className="absolute inset-0 rounded-[32px] ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-700" />

                        {/* 2C. Content */}
                        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="p-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
                                    <Cpu size={18} className="text-cyan-400" />
                                </div>
                                {/* Animated Ring */}
                                <div className="relative w-10 h-10 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_10s_linear_infinite]" />
                                    <span className="text-[9px] font-mono text-white">HQ</span>
                                </div>
                            </div>

                            <div>
                                <span className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">
                                    Total Liquidity
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-5xl font-black text-white tracking-tighter"
                                    >
                                        {totalTonValue.toFixed(2)}
                                    </motion.h2>
                                    <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                        TON
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1.5">
                                    <Layers size={12} className="text-zinc-500" />
                                    <span className="text-[10px] font-bold text-white">
                                        {products.length} <span className="text-zinc-500 font-normal">ASSETS MINTED</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* --- 3. FILTER MATRIX (Liquid Tabs) --- */}
                <section className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity blur-md" />
                        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center h-14 overflow-hidden shadow-lg">
                            <div className="pl-4 pr-3 text-zinc-600 group-focus-within:text-cyan-400 transition-colors">
                                <Search size={18} />
                            </div>
                            <input
                                className="w-full bg-transparent text-xs font-mono text-white placeholder:text-zinc-700 uppercase outline-none h-full tracking-wider"
                                placeholder="SEARCH HASH / ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="pr-2">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-600 border border-white/5">
                                    <Filter size={14} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scrolling Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
                        {categories.map((cat) => {
                            const isActive = filterCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className="relative px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all outline-none"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                        />
                                    )}
                                    <span className={`relative z-10 ${isActive ? 'text-black' : 'text-zinc-500'}`}>
                                        {cat}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* --- 4. INVENTORY RACK (The List) --- */}
                <section className="space-y-3 pb-24">
                    <div className="flex items-center gap-2 pl-2 opacity-40 mb-2">
                        <Scan size={12} />
                        <span className="text-[9px] font-mono uppercase tracking-widest">Database_Entries</span>
                    </div>

                    {loading ? (
                        <div className="py-24 border border-dashed border-zinc-800 rounded-[32px] flex flex-col items-center justify-center gap-4 opacity-50">
                            <div className="w-10 h-10 border-2 border-t-cyan-500 border-white/10 rounded-full animate-spin" />
                            <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest">
                                Decrypting...
                            </span>
                        </div>
                    ) : (
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map((product, i) => (
                                <motion.div
                                    layout
                                    key={product._id || i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative"
                                >
                                    {/* The Asset Slate */}
                                    <div className="relative h-24 bg-[#0c0c0c] border border-white/5 rounded-[24px] overflow-hidden flex items-center pr-4 transition-all duration-300 hover:border-white/10 hover:bg-[#111]">

                                        {/* Image Sector */}
                                        <div className="relative w-24 h-full border-r border-white/5 bg-black">
                                            <img src={product.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" alt="" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                                            {/* ID Tag */}
                                            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-white/10 backdrop-blur-md rounded border border-white/5">
                                                <span className="text-[6px] font-mono text-white">
                                                    #{product._id?.slice(-4).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info Sector */}
                                        <div className="flex-1 pl-4 flex flex-col justify-center gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                                                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">
                                                    Active
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-black text-white uppercase tracking-tight truncate max-w-[150px]">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xs font-bold text-zinc-400">VAL</span>
                                                <span className="text-sm font-black text-white">{product.priceTon}</span>
                                            </div>
                                        </div>

                                        {/* Interaction Sector (Hidden triggers) */}
                                        <div className="flex items-center gap-3 pl-4 border-l border-dashed border-white/5 h-12">

                                            <Link href={`/admin/products/edit-product/${product?._id}`}>
                                                <button className="group/edit w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 hover:bg-white hover:text-black transition-all">
                                                    <Edit2 size={14} />
                                                </button>
                                            </Link>

                                            <button
                                                onClick={() => deleteProduct(product?._id)}
                                                className="group/del w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </section>

                {/* --- 5. FLOATING COMMAND BAR (The Dock) --- */}
                <div className="fixed bottom-8 inset-x-6 z-50">
                    <Link href="/admin/products/add-product">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-16 rounded-[28px] bg-white text-black flex items-center justify-between px-2 shadow-[0_0_40px_rgba(255,255,255,0.15)] group overflow-hidden relative"
                        >
                            {/* Animated Shine */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                            <div className="w-12 h-12 rounded-[22px] bg-black text-white flex items-center justify-center relative z-10">
                                <Plus size={20} />
                            </div>

                            <span className="text-xs font-black uppercase tracking-[0.2em] relative z-10 mr-auto ml-4">
                                Mint New Asset
                            </span>

                            <div className="pr-6 relative z-10">
                                <ArrowUpRight size={18} />
                            </div>
                        </motion.button>
                    </Link>
                </div>

            </main>
        </div>
    );
};
export default ProductManager;