"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, Loader2,
    Search, ShoppingBag, ArrowUpRight,
    Package, Filter,
    Clock
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import Background from '@/components/Background';
import { useOrderStore } from '@/app/store/useOrderStore';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';

export default function OrderHistory() {
    const { userOrders, fetchUserOrders, loading } = useOrderStore();
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.BackButton.show();
            WebApp.BackButton.onClick(() => router.back());

            const telegramUser = WebApp.initDataUnsafe?.user;
            const userId = telegramUser?.id?.toString() || "PORTFOLIO_REVIEWER";
            fetchUserOrders(userId);
        }
    }, [fetchUserOrders, router]);

    // Filter Logic
    const filteredPurchases = userOrders.filter(order =>
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Calc Total
    const totalSpent = userOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    // Helpers
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
    };
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500 overflow-x-hidden relative pb-32">
            <Background />
            <PageHeader title="Order History" />
            <main className="relative z-10 pt-24 px-4 space-y-8">
                <section className="relative w-full aspect-2/1 rounded-[32px] p-px overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 via-zinc-800/50 to-black" />

                    <div className="relative w-full h-full bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[31px] p-6 flex flex-col justify-between overflow-hidden">

                        {/* Top Info */}
                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <Package size={12} className="text-amber-500" />
                                <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-300">
                                    Lifetime Volume
                                </span>
                            </div>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/TON_ICON.png/500px-TON_ICON.png" className="w-6 h-6 opacity-100 rounded-2xl" alt="TON" />
                        </div>

                        {/* Middle: Big Numbers */}
                        <div className="relative z-10">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 block">
                                Total Asset Value
                            </span>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-4xl font-black text-white tracking-tighter">
                                    {totalSpent.toFixed(2)}
                                </h2>
                                <span className="text-sm font-bold text-amber-500">TON</span>
                            </div>
                        </div>

                        {/* Bottom: Count */}
                        <div className="relative z-10 border-t border-white/5 pt-3 flex justify-between items-center">
                            <span className="text-[9px] font-mono text-zinc-600">ACC_ID: PORTFOLIO_DEMO</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">{userOrders.length}</span>
                                <span className="text-[9px] text-zinc-500 uppercase">Settled Orders</span>
                            </div>
                        </div>
                    </div>
                </section>
                {/* --- 3. SEARCH & FILTER --- */}
                <div className="sticky top-20 z-40 bg-[#050505]/80 backdrop-blur-xl py-2 -mx-4 px-4 border-b border-white/5">
                    <div className="relative bg-zinc-900/50 border border-white/10 rounded-xl flex items-center h-12">
                        <div className="pl-4 pr-3 text-zinc-500">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="SEARCH HASH OR ASSET..."
                            className="bg-transparent flex-1 text-[10px] font-mono text-white placeholder:text-zinc-600 uppercase outline-none h-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="px-4 h-full border-l border-white/5 text-zinc-500 hover:text-white transition-colors">
                            <Filter size={14} />
                        </button>
                    </div>
                </div>

                {/* --- 4. THE DATA SLATES (List) --- */}
                <section className="space-y-4 min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-4 opacity-50">
                            <Loader2 className="animate-spin text-amber-500" />
                            <span className="text-[9px] font-mono uppercase tracking-widest">Fetching Order...</span>
                        </div>
                    ) : (
                        <AnimatePresence mode='popLayout'>
                            {filteredPurchases.length > 0 ? (
                                filteredPurchases.map((order, i) => {
                                    // Status Logic & Colors
                                    const isCompleted = order.status === 'COMPLETED' || order.status === 'DEMO_COMPLETED';
                                    const isPending = order.status === 'PENDING';
                                    // Color Palette
                                    const themeColor = isCompleted ? '#10b981' : '#f59e0b';
                                    const StatusIcon = isCompleted ? CheckCircle2 : (isPending ? Loader2 : Clock);

                                    return (
                                        <motion.div
                                            key={order._id}
                                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                                            className="group relative mb-5"
                                        >
                                            {/* --- 1. AMBIENT GLOW (Behind) --- */}
                                            <div
                                                className="absolute inset-4 rounded-[30px] blur-[30px] opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                                                style={{ backgroundColor: themeColor }}
                                            />

                                            {/* --- 2. MAIN CHASSIS (Metal Plate) --- */}
                                            <div className="relative w-full bg-[#080808] rounded-[32px] border border-white/5 overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:border-white/10 group-hover:shadow-2xl">

                                                {/* Background Texture & Watermark */}
                                                <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                                                <div className="absolute -right-10 -bottom-10 opacity-[0.03] transform -rotate-12 scale-150 pointer-events-none">
                                                    <StatusIcon size={200} />
                                                </div>

                                                {/* Top "Power Line" Gradient */}
                                                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                                                <div className="relative p-1 flex">

                                                    {/* --- LEFT SECTION: ASSET VISUAL --- */}
                                                    <div className="p-3 pr-0">
                                                        <div className="relative w-24 h-24 rounded-[24px] overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-white/20 transition-colors">
                                                            <img
                                                                src={order.products[0]?.image}
                                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                                                alt=""
                                                            />
                                                            {/* Glass Glare */}
                                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

                                                            {/* Status Chip Overlay */}
                                                            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md rounded-lg py-1 flex items-center justify-center gap-1.5 border border-white/10">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${isPending ? 'animate-spin border-t-2 border-amber-500' : 'bg-emerald-500 shadow-[0_0_5px_#10b981]'}`} />
                                                                <span className="text-[7px] font-black uppercase tracking-widest text-white">
                                                                    {isPending ? 'SYNCING' : 'OWNED'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* --- MIDDLE SECTION: METADATA --- */}
                                                    <div className="flex-1 py-4 px-4 flex flex-col justify-center min-w-0">
                                                        {/* Header */}
                                                        <div className="flex items-center gap-2 mb-1 opacity-50">
                                                            <span className="text-[8px] font-mono uppercase tracking-widest">
                                                                {formatDate(order.createdAt!)}
                                                            </span>
                                                            <div className="w-1 h-1 rounded-full bg-zinc-500" />
                                                            <span className="text-[8px] font-mono uppercase">
                                                                #{order._id?.slice(-6).toUpperCase()}
                                                            </span>
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="text-lg font-black text-white italic uppercase tracking-tighter leading-none mb-1 truncate">
                                                            {order.products[0]?.name}
                                                        </h3>

                                                        {/* Subtitle / Count */}
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="px-2 py-0.5 rounded border border-white/10 text-[9px] font-bold text-zinc-400 uppercase bg-white/5">
                                                                Digital Asset
                                                            </span>
                                                            {order.products.length > 1 && (
                                                                <span className="text-[9px] font-bold text-amber-500">
                                                                    +{order.products.length - 1} Bundle
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* --- RIGHT SECTION: THE TICKET STUB --- */}
                                                    <div className="relative w-24 border-l border-dashed border-white/10 flex flex-col items-center justify-center bg-white/[0.02]">
                                                        {/* Top & Bottom "Cutout" notches */}
                                                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-[#020617]" />
                                                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-[#020617]" />

                                                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">
                                                            Total
                                                        </span>
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-xl font-black text-white tracking-tighter drop-shadow-md">
                                                                {order.totalAmount}
                                                            </span>
                                                            <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: themeColor }}>
                                                                TON
                                                            </span>
                                                        </div>

                                                        {/* Interactive Arrow */}
                                                        <div
                                                            className="absolute bottom-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 opacity-20 group-hover:opacity-100 group-hover:scale-110"
                                                            style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                                                        >
                                                            <ArrowUpRight size={14} />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="py-6 border border-dashed border-zinc-800 rounded-[30px] flex flex-col items-center justify-center opacity-40 gap-4">
                                    <div className="w-20 h-20 rounded-full bg-zinc-900/50 flex items-center justify-center border border-white/5">
                                        <ShoppingBag size={32} className="text-zinc-600" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs font-bold text-white uppercase tracking-widest">Vault Empty</span>
                                        <span className="text-[9px] font-mono text-zinc-500">NO TRANSACTIONS RECORDED</span>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    )}
                </section>
            </main>
        </div>
    );
}