"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, Truck, Clock, Loader2,
    Search, Package, CreditCard, ShoppingBag, ChevronRight
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import Background from '@/components/Background';
import PageHeader from '@/components/PageHeader';
import { useOrderStore } from '@/app/store/useOrderStore';

export default function OrderHistory() {
    const { userOrders, fetchUserOrders, loading } = useOrderStore();
    const [searchTerm, setSearchTerm] = useState('');

    console.log(userOrders);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            // Get the user ID from Telegram
            const telegramUser = WebApp.initDataUnsafe?.user;
            const userId = telegramUser?.id?.toString() || "PORTFOLIO_REVIEWER";

            // Fetch real orders from the DB
            fetchUserOrders(userId);
        }
    }, [fetchUserOrders]);

    // Filter dynamic orders instead of static array
    const filteredPurchases = userOrders.filter(order =>
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusIcon = (status: string) => {
        if (status === "DEMO_COMPLETED" || status === "COMPLETED")
            return <CheckCircle2 size={12} className="text-green-400" />;
        if (status === "PENDING")
            return <Loader2 size={12} className="text-blue-400 animate-spin" />;
        return <Clock size={12} className="text-zinc-500" />;
    };

    const getStatusColors = (status: string) => {
        if (status === "DEMO_COMPLETED" || status === "COMPLETED") return "text-green-400 border-green-700/50";
        if (status === "PENDING") return "text-blue-400 border-blue-700/50";
        return "text-zinc-500 border-zinc-700/50";
    };

    // Calculate total spent from real data
    const totalSpent = userOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-amber-500 overflow-x-hidden relative pb-40">
            <Background />
            <PageHeader title="PURCHASES" subtitle="ORDER HISTORY" color="#f59e0b" />

            <main className="relative z-10 pt-28 px-6 space-y-8">
                {/* --- Stats --- */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-[25px] bg-[#0c0c0c] border border-white/5 flex flex-col justify-between h-32">
                        <div className="flex items-center gap-2">
                            <CreditCard size={16} className="text-zinc-400" />
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Total Spent</span>
                        </div>
                        <span className="text-3xl font-extrabold text-white">{totalSpent.toFixed(2)} <span className="text-[12px] text-amber-500">TON</span></span>
                    </div>

                    <div className="p-5 rounded-[25px] bg-[#0c0c0c] border border-white/5 flex flex-col justify-between h-32">
                        <div className="flex items-center gap-2">
                            <ShoppingBag size={16} className="text-zinc-400" />
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Orders</span>
                        </div>
                        <span className="text-3xl font-extrabold text-white">{userOrders.length}</span>
                    </div>
                </section>

                {/* --- Search --- */}
                <section>
                    <div className="relative bg-[#0c0c0c]/70 rounded-full pl-6 pr-4 py-3 border border-white/10 flex items-center gap-3">
                        <Search size={18} className="text-zinc-600" />
                        <input
                            type="text"
                            placeholder="FIND AN ORDER ID OR PRODUCT..."
                            className="bg-transparent flex-1 text-sm text-white outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </section>

                {/* --- List --- */}
                <section className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-amber-500" /></div>
                    ) : (
                        <AnimatePresence>
                            {filteredPurchases.map((order, i) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`relative bg-[#0c0c0c] rounded-[30px] p-4 flex items-center gap-4 border ${getStatusColors(order.status)}`}
                                >
                                    {/* Using first product image as preview */}
                                    <img src={order.products[0]?.image} className="w-16 h-16 rounded-[22px] object-cover" alt="" />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-base font-extrabold text-white uppercase truncate">
                                                    {order.products[0]?.name} {order.products.length > 1 && `+${order.products.length - 1}`}
                                                </h3>
                                                <span className="text-[8px] font-mono text-zinc-600">ID: {order._id?.slice(-8).toUpperCase()}</span>
                                            </div>
                                            <ChevronRight size={18} className="text-zinc-700" />
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(order.status)}
                                                    <span className={`text-[9px] font-bold uppercase ${getStatusColors(order.status)}`}>{order.status}</span>
                                                </div>
                                                <span className="text-[8px] text-zinc-600">{new Date(order.createdAt!).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-extrabold text-white">{order.totalAmount} TON</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </section>
            </main>
        </div>
    );
}