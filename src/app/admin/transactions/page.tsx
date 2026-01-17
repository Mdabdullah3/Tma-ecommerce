/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Background from '@/components/Background';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Hash, DollarSign, Calendar, User, ExternalLink, Loader2 } from 'lucide-react';
import { useOrderStore } from '@/app/store/useOrderStore';

export default function AdminTransactionsPage() {
    // 1. Connect to Zustand Store
    const { orders, fetchAllOrders, loading } = useOrderStore();

    const [webApp, setWebApp] = useState<any>(null);

    useEffect(() => {
        // Initialize Telegram WebApp
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
            const twa = (window as any).Telegram.WebApp;
            setWebApp(twa);
            twa.ready();
        }

        // 2. Fetch all orders from the database
        fetchAllOrders();
    }, [fetchAllOrders]);

    const handleViewTransaction = (hash?: string) => {
        if (!hash) return;
        const tonExplorerUrl = `https://tonscan.org/tx/${hash}`;
        if (webApp) {
            webApp.openLink(tonExplorerUrl);
        } else {
            window.open(tonExplorerUrl, '_blank');
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-[#01030d] text-white font-sans relative p-6 pb-24">
            <Background />
            <PageHeader title="ADMIN_PANEL" subtitle="GLOBAL TRANSACTIONS" />

            <motion.div

                className="relative z-10 pt-20 space-y-6"
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        <p>Accessing Ledger...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center text-zinc-500 py-20">
                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No orders recorded in the database.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {orders.map((order) => (
                            <motion.div
                                key={order._id}
                                variants={itemVariants}
                                className="bg-[#0c0c0c]/80 border border-white/5 rounded-2xl p-5 backdrop-blur-md group hover:border-amber-500/30 transition-all shadow-2xl"
                            >
                                {/* Header: Product Name and Status */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-tighter">
                                            {order.products[0]?.name || "Unknown Product"}
                                            {order.products.length > 1 && <span className="text-amber-500 ml-1">+{order.products.length - 1} MORE</span>}
                                        </h3>
                                        <span className={`text-[10px] font-black mt-1 ${order.status === 'DEMO_COMPLETED' ? 'text-green-400' : 'text-amber-500'}`}>
                                            ● {order.status}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black text-white">{order.totalAmount} <span className="text-xs text-amber-500">TON</span></div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 gap-2 text-[11px] text-zinc-400">
                                    <div className="flex items-center gap-2">
                                        <User size={12} className="text-zinc-600" />
                                        <span>User: <span className="text-zinc-200">{order.user}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} className="text-zinc-600" />
                                        <span>{new Date(order.createdAt!).toLocaleString()}</span>
                                    </div>

                                    {order.transactionHash && (
                                        <button
                                            onClick={() => handleViewTransaction(order.transactionHash)}
                                            className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5 hover:text-amber-400 transition-colors group/tx"
                                        >
                                            <Hash size={12} className="text-zinc-600 group-hover/tx:text-amber-500" />
                                            <span className="font-mono truncate">TX: {order.transactionHash}</span>
                                            <ExternalLink size={10} className="ml-auto" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}