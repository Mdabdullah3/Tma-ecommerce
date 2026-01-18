/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from 'react';
import Background from '@/components/Background';
import { motion } from 'framer-motion';
import {
    Hash, User,
    ArrowUpRight, Box, Filter,
} from 'lucide-react';
import { useOrderStore } from '@/app/store/useOrderStore';
import PageHeader from '@/components/PageHeader';

export default function AdminTransactionsPage() {
    const { orders, fetchAllOrders, loading } = useOrderStore();
    const [webApp, setWebApp] = useState<any>(null);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
            const twa = (window as any).Telegram.WebApp;
            setWebApp(twa);
            twa.ready();
        }
        fetchAllOrders();
    }, [fetchAllOrders]);

    const handleViewTransaction = (hash?: string) => {
        if (!hash) return;
        const url = `https://tonscan.org/tx/${hash}`;
        if (webApp) webApp.openLink(url);
        else window.open(url, '_blank');
    };
    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans relative pb-32 overflow-x-hidden selection:bg-cyan-500/30">
            <Background />
            <PageHeader title="TRANSACTIONS" />

            {/* --- 3. FILTER BAR (Glass Pill) --- */}
            <div className="sticky top-4 pt-18 z-40 px-4 mb-6">
                <div className="h-14 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 flex items-center p-1 shadow-2xl">
                    <div className="flex-1 flex items-center px-4 gap-3">
                        <Filter size={16} className="text-zinc-500" />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                            Showing All Entries
                        </span>
                    </div>
                    <div className="flex gap-1">
                        {['ALL', 'PENDING'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wide transition-all ${filter === f ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:bg-white/5'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- 4. THE DATA STREAM (Transaction List) --- */}
            <main className="relative z-10 px-4 pb-20 space-y-4 pt-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                        <div className="w-12 h-12 border-2 border-t-cyan-500 border-white/10 rounded-full animate-spin" />
                        <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest animate-pulse">
                            Decrypting_Ledger...
                        </span>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-24 border border-dashed border-zinc-800 rounded-[32px] flex flex-col items-center justify-center gap-4 opacity-30">
                        <Box size={32} />
                        <span className="text-[10px] font-mono uppercase tracking-widest">Chain Idle</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {orders.map((order, i) => (
                            <TransactionCard
                                key={order._id || i}
                                order={order}
                                index={i}
                                onViewHash={handleViewTransaction}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}


const TransactionCard = ({ order, index, onViewHash }: any) => {
    const isDemo = order.status === 'DEMO_COMPLETED' || order.status === 'DEMO';
    const accent = isDemo ? '#3b82f6' : '#10b981';
    const statusText = isDemo ? 'TESTNET' : 'MAINNET';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative"
        >
            {/* Card Body */}
            <div className="relative bg-[#0c0c0c] rounded-[24px] border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-[#111]">

                {/* Top Section: User & Status */}
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
                            <User size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wide">
                                User_{order.user.slice(0, 4)}
                            </span>
                            <span className="text-[8px] font-mono text-zinc-600">
                                {new Date(order.createdAt!).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                        <span className="text-[8px] font-black uppercase tracking-wider text-zinc-400">
                            {statusText}
                        </span>
                    </div>
                </div>

                {/* Middle Section: Asset Info */}
                <div className="p-4 flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0">
                        <img src={order.products[0]?.image} className="w-full h-full object-cover opacity-80" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-white uppercase tracking-tight truncate">
                            {order.products[0]?.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                                ERC-721
                            </span>
                            {order.products.length > 1 && (
                                <span className="text-[8px] font-bold text-amber-500">+{order.products.length - 1} More</span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-lg font-black text-white tracking-tighter">
                            {order.totalAmount}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-500">TON</span>
                    </div>
                </div>

                {/* Bottom Section: Hash Link (Holographic Button) */}
                {order.transactionHash && (
                    <div onClick={() => onViewHash(order.transactionHash)} className="relative h-10 bg-white/2 flex items-center justify-between px-4 cursor-pointer group/hash overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/hash:translate-x-full transition-transform duration-700" />

                        <div className="flex items-center gap-2 opacity-40 group-hover/hash:opacity-100 transition-opacity">
                            <Hash size={12} className="text-zinc-400" />
                            <span className="text-[9px] font-mono text-zinc-400">
                                {order.transactionHash.slice(0, 12)}...
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-[8px] font-bold text-zinc-600 group-hover/hash:text-white transition-colors uppercase tracking-widest">
                            Verify <ArrowUpRight size={10} />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}