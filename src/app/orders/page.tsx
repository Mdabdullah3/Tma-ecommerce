"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Trash2, Zap, Box, ArrowRight,
    Ticket, X, ShieldCheck
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import Background from '@/components/Background';
import PageHeader from '@/components/PageHeader';

const ORDER_ITEMS = [
    { id: 1, name: "ROSE_GENESIS", price: 2.40, cat: "ART_CORE", supply: "1/50", img: "https://nftmak.netlify.app/assets/img/others/top_collection01.jpg" },
    { id: 2, name: "AMETHYST_V1", price: 1.15, cat: "NEO_WEAR", supply: "12/100", img: "https://nftmak.netlify.app/assets/img/others/top_collection02.jpg" },
];

export default function OrderPage() {
    const [coupon, setCoupon] = useState("");
    const [isApplied, setIsApplied] = useState(false);
    
    const subtotal = ORDER_ITEMS.reduce((acc, item) => acc + item.price, 0);
    const protocolFee = 0.05;
    const discount = isApplied ? 0.25 : 0;
    const total = subtotal + protocolFee - discount;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
            WebApp.setHeaderColor('#020617');
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-amber-500 overflow-x-hidden relative">
            <Background />
            <PageHeader />

            <main className="relative z-10 pt-20 pb-44 px-6 space-y-8">
                
                {/* --- 1. ITEM CHAMBERS (Cart Style) --- */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
                        <span className="text-[9px] font-black tracking-[0.4em] text-zinc-500 uppercase">Selected_Artifacts</span>
                        <div className="h-[0.5px] flex-1 bg-white/5" />
                    </div>

                    <div className="space-y-4">
                        {ORDER_ITEMS.map((item) => (
                            <div key={item.id} className="relative group">
                                <div className="absolute inset-0 bg-linear-to-r from-amber-900/10 to-transparent rounded-[40px] -z-10" />
                                <div className="bg-[#050505]/40 rounded-[40px] p-4 flex items-center gap-4 border border-white/5 shadow-2xl">
                                    <div className="relative w-20 h-20 rounded-[24px] overflow-hidden border border-white/10 shadow-inner">
                                        <img src={item.img} className="w-full h-full object-cover grayscale brightness-75" alt="T" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent" />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[7px] font-mono font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">ID_0{item.id}</span>
                                            <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">{item.supply}</span>
                                        </div>
                                        <h3 className="text-sm font-black italic tracking-tighter text-white uppercase leading-none">{item.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-black text-white italic">{item.price}</span>
                                            <span className="text-[9px] font-bold text-zinc-500 uppercase">TON</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- 2. VOUCHER CHAMBER (Matched Style) --- */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4 px-2">
                        <span className="text-[9px] font-black tracking-[0.4em] text-zinc-500 uppercase italic">Protocol_Discount</span>
                        <div className="h-[0.5px] flex-1 bg-white/5" />
                    </div>
                    <div className="bg-[#0c0c0c]/40 rounded-[35px] p-2 flex items-center border border-white/5 gap-3 shadow-2xl">
                        <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500">
                            <Ticket size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="VOUCHER_CODE"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            className="bg-transparent flex-1 text-xs font-black tracking-widest outline-none placeholder:text-zinc-700 uppercase italic"
                        />
                        <button 
                            onClick={() => setIsApplied(!isApplied)}
                            className={`h-11 px-6 rounded-2xl font-black text-[9px] tracking-widest uppercase italic transition-all ${isApplied ? 'bg-amber-500 text-black' : 'bg-white text-black'}`}
                        >
                            {isApplied ? 'REMOV' : 'APPLY'}
                        </button>
                    </div>
                </div>

                {/* --- 3. FINANCIAL AUDIT (Cart Style) --- */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4 px-2">
                        <span className="text-[9px] font-black tracking-[0.4em] text-zinc-500 uppercase italic">Financial_Audit</span>
                        <div className="h-[0.5px] flex-1 bg-white/5" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-[35px] bg-[#0c0c0c]/40 border border-white/5 flex flex-col justify-between h-32">
                            <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Subtotal</span>
                            <span className="text-lg font-black italic text-white leading-none">{subtotal.toFixed(2)} <span className="text-[9px] text-zinc-500">TON</span></span>
                        </div>
                        <div className="p-6 rounded-[35px] bg-[#0c0c0c]/40 border border-white/5 flex flex-col justify-between h-32 text-right items-end">
                            <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Protocol_Fee</span>
                            <span className="text-lg font-black italic text-amber-500 leading-none">+{protocolFee} <span className="text-[9px]">TON</span></span>
                        </div>
                    </div>
                    {isApplied && (
                        <div className="p-5 rounded-[32px] bg-amber-500/5 border border-amber-500/10 flex justify-between items-center px-8 animate-pulse">
                            <span className="text-[8px] font-black uppercase tracking-widest text-amber-500 italic leading-none uppercase">Sovereign_Discount_Applied</span>
                            <span className="text-xs font-black italic text-white">-{discount.toFixed(2)} TON</span>
                        </div>
                    )}
                </div>
            </main>

            {/* --- 4. THE CERAMIC EXECUTION DOCK (Cart Style) --- */}
            <div className="fixed bottom-0 inset-x-0 z-[110] px-6 pb-6 pt-6 bg-linear-to-t from-black via-black/90 to-transparent font-sans">
                <div className="bg-white text-black rounded-[45px] p-2.5 flex items-center justify-between shadow-[0_20px_50px_rgba(255,255,255,0.15)]">
                    <div className="pl-6 flex flex-col">
                        <span className="text-[7px] font-black uppercase tracking-widest text-zinc-400 italic">Total_Cost</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-2xl font-black italic tracking-tighter leading-none">{total.toFixed(2)}</span>
                            <span className="text-[9px] font-bold text-zinc-900 leading-none">TON</span>
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-10 h-14 rounded-full font-black text-[10px] tracking-[0.3em] uppercase italic bg-zinc-950 text-white shadow-xl overflow-hidden"
                    >
                        {/* Kinetic Liquid Fill hover effect */}
                        <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10 flex items-center gap-3">
                            Confirm_Order
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </motion.button>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');
                body { background-color: #020617; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
                ::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}