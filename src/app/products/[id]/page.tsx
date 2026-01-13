"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Share2,
    ArrowRight
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import Background from '@/components/Background';
import PageHeader from '@/components/PageHeader';

const PRODUCT = {
    id: 1,
    name: "ROSE_GENESIS",
    price: "2.40",
    cat: "ART_CORE",
    series: "V.082",
    edition: "01/50",
    img: "https://nftmak.netlify.app/assets/img/others/top_collection01.jpg",
    desc: "High-fidelity digital artifact synthesized for the Sovereign collective. Features 256-bit encryption mapping and modular visual nodes."
};

export default function ProductDetails() {
    const [isAcquired, setIsAcquired] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.BackButton.show();
            WebApp.BackButton.onClick(() => window.history.back());
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-amber-500 overflow-x-hidden relative">

            <Background />
            <PageHeader title="PRODUCT_DETAILS" />
            <main className="relative z-10 pt-20 pb-40 px-6">
                <section className="mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative aspect-4/5 rounded-[50px] overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
                    >
                        <img src={PRODUCT.img} className="w-full h-full object-cover scale-105" alt="Artifact" />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />
                    </motion.div>
                </section>

                {/* --- CONTENT SECTION: EDITORIAL LAYOUT --- */}
                <section className="space-y-6">

                    {/* Identity Stack */}
                    <div className="flex flex-col gap-2">

                        <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                            {PRODUCT.name.split('_')[0]} <br />
                            <span className="text-amber-500">{PRODUCT.name.split('_')[1]}</span>
                        </h1>
                    </div>


                    {/* Description Block */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black tracking-widest uppercase italic text-zinc-500">Overview</span>
                            <div className="h-[1px] flex-1 bg-white/5" />
                        </div>
                        <p className="text-[11px] font-medium leading-relaxed text-zinc-400 uppercase tracking-wide">
                            {PRODUCT.desc}
                        </p>
                    </div>
                </section>
            </main>
            <div className="fixed bottom-0 inset-x-0 z-110 px-6 pb-4 pt-6 bg-linear-to-t from-black via-black/90 to-transparent">
                <div className="bg-primary text-white rounded-[40px] p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(255,255,255,0.15)]">

                    <div className="pl-6 flex flex-col">
                        <span className="text-[7px] font-black uppercase tracking-widest text-zinc-100 italic">Total_Cost</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black italic tracking-tighter">{PRODUCT.price}</span>
                            <span className="text-[10px] font-bold text-zinc-900">TON</span>
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAcquired(!isAcquired)}
                        className={`px-8 h-12 rounded-full font-black text-xs tracking-widest uppercase italic cursor-pointer flex items-center gap-3 transition-all duration-700 
              ${isAcquired ? 'bg-amber-500 text-white' : 'bg-zinc-950 text-white shadow-xl'}`}
                    >
                        {isAcquired ? 'Ordered' : 'Order'}
                        <ArrowRight size={16} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}