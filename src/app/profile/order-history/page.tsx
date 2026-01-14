/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ShoppingBag, CheckCircle2, Truck,
    ChevronRight, Package, CreditCard, Search,
    Clock, ArrowUpRight, Loader2
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import Background from '@/components/Background'; // Assuming this provides a sophisticated dark background
import PageHeader from '@/components/PageHeader';

const PURCHASES = [
    { id: "ORD-90281", name: "ROSE_GENESIS", status: "Delivered", price: "2.40", date: "Oct 24, 2026", img: "https://nftmak.netlify.app/assets/img/others/top_collection01.jpg" },
    { id: "ORD-11029", name: "AMETHYST_V1", status: "In Transit", price: "1.15", date: "Oct 22, 2026", img: "https://nftmak.netlify.app/assets/img/others/top_collection02.jpg" },
    { id: "ORD-00827", name: "CHROME_CORE", status: "Processing", price: "4.80", date: "Oct 15, 2026", img: "https://shreethemes.in/superex/layouts/images/items/3.jpg" },
    { id: "ORD-00828", name: "NEON_SPARK", status: "Delivered", price: "0.95", date: "Oct 10, 2026", img: "https://nftmak.netlify.app/assets/img/others/top_collection03.jpg" },
    { id: "ORD-00829", name: "QUANTUM_FLOW", status: "Processing", price: "3.20", date: "Oct 05, 2026", img: "https://nftmak.netlify.app/assets/img/others/top_collection04.jpg" },
];

export default function OrderHistory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPurchases, setFilteredPurchases] = useState(PURCHASES);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
            WebApp.setHeaderColor('#020617');
        }
    }, []);

    useEffect(() => {
        setFilteredPurchases(
            PURCHASES.filter(order =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Delivered":
                return <CheckCircle2 size={12} className="text-green-400" />;
            case "In Transit":
                return <Truck size={12} className="text-amber-400" />;
            case "Processing":
                return <Loader2 size={12} className="text-blue-400 animate-spin" />;
            default:
                return <Clock size={12} className="text-zinc-500" />;
        }
    };

    const getStatusColors = (status: string) => {
        switch (status) {
            case "Delivered":
                return "text-green-400 border-green-700/50";
            case "In Transit":
                return "text-amber-400 border-amber-700/50";
            case "Processing":
                return "text-blue-400 border-blue-700/50";
            default:
                return "text-zinc-500 border-zinc-700/50";
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-['Inter',sans-serif] selection:bg-amber-500 overflow-x-hidden relative pb-40">
            {/* Background component should handle sophisticated gradients/textures */}
            <Background />

            {/* Premium Header */}
            <PageHeader title="PURCHASES" subtitle="ORDER HISTORY" color="#f59e0b" />

            <main className="relative z-10 pt-28 px-6 space-y-8 md:space-y-10">

                {/* --- 1. Elevated Shopping Stats --- */}
                <section className="grid grid-cols-2 gap-4">
                    <motion.div
                        className="p-5 rounded-[25px] bg-gradient-to-br from-[#0c0c0c] to-[#040404] border border-white/5 flex flex-col justify-between h-32 shadow-2xl overflow-hidden relative group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="absolute inset-0 bg-amber-500/5 rounded-[25px] blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        <div className="relative z-10 flex items-center gap-2 mb-2">
                            <CreditCard size={16} className="text-zinc-400 group-hover:text-amber-400 transition-colors" />
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Total Spent</span>
                        </div>
                        <div className="relative z-10 space-y-0.5">
                            <span className="text-3xl font-extrabold tracking-tight text-white">12.85 <span className="text-[12px] text-amber-500 font-bold">TON</span></span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="p-5 rounded-[25px] bg-gradient-to-br from-[#0c0c0c] to-[#040404] border border-white/5 flex flex-col justify-between h-32 shadow-2xl overflow-hidden relative group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="absolute inset-0 bg-blue-500/5 rounded-[25px] blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        <div className="relative z-10 flex items-center gap-2 mb-2">
                            <ShoppingBag size={16} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Orders</span>
                        </div>
                        <div className="relative z-10 space-y-0.5">
                            <span className="text-3xl font-extrabold tracking-tight text-white">0{PURCHASES.length}</span>
                        </div>
                    </motion.div>
                </section>

                {/* --- 2. Futuristic Search Bar --- */}
                <section className="px-1">
                    <motion.div
                        className="relative bg-[#0c0c0c]/70 rounded-full pl-6 pr-4 py-3 border border-white/10 flex items-center gap-3 shadow-inner shadow-black/50 group"
                        whileFocus={{ borderColor: '#f59e0b' }}
                    >
                        <Search size={18} className="text-zinc-600 group-focus-within:text-amber-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="FIND AN ORDER ID..."
                            className="bg-transparent flex-1 text-sm font-medium tracking-wide text-white outline-none placeholder:text-zinc-700 placeholder:font-light"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </motion.div>
                </section>

                {/* --- 3. Order List: Premium Cards --- */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 px-2 mb-6">
                        <span className="text-[9px] font-bold tracking-[0.4em] text-zinc-600 uppercase leading-none">Order_History</span>
                        <div className="h-[0.5px] flex-1 bg-white/10" />
                    </div>

                    <AnimatePresence>
                        <div className="space-y-4">
                            {filteredPurchases.length > 0 ? (
                                filteredPurchases.map((order, i) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                                        transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 20 }}
                                        whileTap={{ scale: 0.97, borderColor: 'rgba(252, 211, 77, 0.4)' }}
                                        className={`relative group bg-gradient-to-br from-[#0c0c0c] to-[#040404] rounded-[30px] p-4 flex items-center gap-4 shadow-xl border ${getStatusColors(order.status)}`}
                                    >
                                        {/* Dynamic glowing border effect */}
                                        <div className={`absolute inset-0 rounded-[30px] border-2 ${getStatusColors(order.status).replace('border-', 'border-')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} style={{ boxShadow: `0 0 15px -2px ${getStatusColors(order.status).split(' ')[1].replace('border-', '').replace('/50', '')}` }}></div>

                                        {/* Product Thumbnail */}
                                        <div className="relative flex-shrink-0 z-10">
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[22px] md:rounded-[28px] overflow-hidden border border-white/10 group-hover:border-amber-500/50 transition-colors">
                                                <img src={order.img} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-300" alt="Product" />
                                            </div>
                                        </div>

                                        {/* Order Content */}
                                        <div className="flex-1 min-w-0 flex flex-col gap-2 z-10">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col">
                                                    <h3 className="text-base md:text-lg font-extrabold tracking-tight text-white uppercase truncate">{order.name}</h3>
                                                    <span className="text-[8px] md:text-[9px] font-mono font-semibold text-zinc-600 uppercase tracking-wider">{order.id}</span>
                                                </div>
                                                <ChevronRight size={20} className="text-zinc-700 group-hover:text-white transition-colors" />
                                            </div>

                                            <div className="flex justify-between items-end mt-1">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(order.status)}
                                                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${getStatusColors(order.status)}`}>{order.status}</span>
                                                    </div>
                                                    <span className="text-[8px] md:text-[9px] font-medium text-zinc-600 uppercase leading-none">{order.date}</span>
                                                </div>
                                                <div className="text-right flex items-baseline gap-1">
                                                    <span className="text-lg md:text-xl font-extrabold tracking-tight text-white">{order.price}</span>
                                                    <span className="text-[9px] md:text-[10px] font-bold text-amber-500">TON</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-8 text-center text-zinc-500 text-sm font-medium"
                                >
                                    No orders found matching {searchTerm}.
                                </motion.div>
                            )}
                        </div>
                    </AnimatePresence>
                </section>

                {/* --- FOOTER: Refined Branding --- */}
                <div className="mt-20 py-10 flex flex-col items-center text-center space-y-3 opacity-30">
                    <Package size={28} className="text-zinc-700" />
                    <p className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase italic">AUTHENTICATED PURCHASE LEDGER</p>
                </div>
            </main>
        </div>
    );
}