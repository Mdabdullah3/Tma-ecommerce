"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Trash2, ShieldCheck, Zap,
    ChevronRight, Box, ArrowRight,
    Cpu, Layers, Activity
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import Background from '@/components/Background';

const INITIAL_ITEMS = [
    { id: 1, name: "ROSE_GENESIS", price: 2.40, cat: "ART_CORE", supply: "1/50", img: "https://nftmak.netlify.app/assets/img/others/top_collection01.jpg" },
    { id: 2, name: "AMETHYST_V1", price: 1.15, cat: "NEO_WEAR", supply: "12/100", img: "https://nftmak.netlify.app/assets/img/others/top_collection02.jpg" },
];

export default function CollectionVault() {
    const [items, setItems] = useState(INITIAL_ITEMS);
    const subtotal = items.reduce((acc, item) => acc + item.price, 0);
    const protocolFee = 0.05;
    const total = subtotal + protocolFee;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
            WebApp.setHeaderColor('#020617');
        }
    }, []);

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
        WebApp.HapticFeedback.impactOccurred('medium');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-amber-500 overflow-x-hidden relative">
            <Background />

            {/* --- 0.1% TOP COMMAND HUD --- */}
            <nav className="fixed top-0 inset-x-0 z-100 px-6 py-6 flex justify-between items-center bg-linear-to-b from-[#020617] via-[#020617]/80 to-transparent">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.history.back()}
                    className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                >
                    <ArrowLeft size={20} strokeWidth={3} />
                </motion.button>



                <div className="relative">
                    <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center backdrop-blur-xl bg-white/5">
                        <span className="text-[10px] font-black text-amber-500">{items.length}</span>
                    </div>

                </div>
            </nav>

            <main className="relative z-10 pt-24 pb-40 px-6">

                {/* --- ITEM LIST: INDUSTRIAL CHASSIS --- */}
                <div className="space-y-4 ">
                    <div className="flex items-center gap-4 px-2 py-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
                        <span className="text-[9px] font-black tracking-[0.4em] text-zinc-500 uppercase">Selected_Artifacts</span>
                        <div className="h-[0.5px] flex-1 bg-white/5" />
                    </div>

                    <AnimatePresence mode='popLayout'>
                        {items.length > 0 ? items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative group"
                            >
                                {/* The Outer Frame */}
                                <div className="absolute inset-0 bg-linear-to-r from-amber-900/10 to-transparent rounded-[40px] -z-10" />

                                <div className="bg-[#050505]/20 rounded-[40px] p-4 flex items-center gap-4 border border-white/5 shadow-2xl">
                                    {/* Asset Thumbnail with Rim Light */}
                                    <div className="relative w-24 h-24 rounded-[30px] overflow-hidden border border-white/10 shadow-inner">
                                        <img src={item.img} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-700" alt="T" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent" />
                                    </div>

                                    {/* Information Stack */}
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[7px] font-mono font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">ID_0{item.id}</span>
                                            <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">{item.supply} Supply</span>
                                        </div>
                                        <h3 className="text-base font-black italic tracking-tighter text-white uppercase leading-none">{item.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-black text-white italic">{item.price}</span>
                                            <span className="text-[9px] font-bold text-zinc-500">TON</span>
                                        </div>
                                    </div>

                                    {/* Remove Action */}
                                    <motion.button
                                        whileTap={{ scale: 0.8 }}
                                        onClick={() => removeItem(item.id)}
                                        className="w-12 h-12 rounded-2xl bg-rose-500/60 border border-white/5 flex items-center justify-center text-zinc-100 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center gap-4 grayscale opacity-20">
                                <Box size={60} strokeWidth={1} />
                                <span className="text-[10px] font-black tracking-[0.5em] uppercase">Vault_Void</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- BENTO SUMMARY: ACQUISITION DATA --- */}
                {items.length > 0 && (
                    <section className="mt-12 space-y-4">
                        <div className="flex items-center gap-4 px-2">
                            <span className="text-[9px] font-black tracking-[0.4em] text-zinc-500 uppercase italic">Financial_Audit</span>
                            <div className="h-[0.5px] flex-1 bg-white/5" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-[35px] bg-[#0c0c0c]/20 border border-white/5 flex flex-col justify-between h-32">
                                <Layers size={18} className="text-zinc-700" />
                                <div>
                                    <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Asset_Subtotal</span>
                                    <span className="text-xl font-black italic text-white leading-none">{subtotal.toFixed(2)} <span className="text-[10px] text-zinc-500">TON</span></span>
                                </div>
                            </div>
                            <div className="p-6 rounded-[35px] bg-[#0c0c0c]/20 border border-white/5 flex flex-col justify-between h-32 text-right items-end">
                                <Activity size={18} className="text-amber-500/50" />
                                <div>
                                    <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Protocol_Fee</span>
                                    <span className="text-xl font-black italic text-amber-500 leading-none">+{protocolFee} <span className="text-[10px]">TON</span></span>
                                </div>
                            </div>
                        </div>


                    </section>
                )}
            </main>

            {/* --- 2026 EXECUTION HUB (STICKY DOCK) --- */}
            {items.length > 0 && (
                <div className="fixed bottom-0 inset-x-0 z-110 px-6 pb-4 pt-6 bg-linear-to-t from-black via-black/90 to-transparent">
                    <div className="bg-primary text-white rounded-[40px] p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(255,255,255,0.15)]">

                        <div className="pl-6 flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-widest text-zinc-100 italic">Total_Cost</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black italic tracking-tighter">{total.toFixed(2)}</span>
                                <span className="text-[10px] font-bold text-zinc-900">TON</span>
                            </div>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className={`px-8 h-12 rounded-full font-black text-xs tracking-widest uppercase italic cursor-pointer flex items-center gap-3 transition-all duration-700 
                            bg-zinc-950 text-white shadow-xl`}
                        >

                            Proceed
                            <ArrowRight size={16} />
                        </motion.button>
                    </div>
                </div>
            )}
        </div>
    );
}