/* eslint-disable react-hooks/purity */
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Shirt, Palette, Layers, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

const CATEGORIES = [
    { id: 'all', name: 'GENESIS', icon: Star, color: '#10b981', shadow: 'rgba(244, 63, 94, 0.6)', label: 'SERIES.01' },
    { id: 'wear', name: 'APPAREL', icon: Shirt, color: '#fbbf24', shadow: 'rgba(251, 191, 36, 0.6)', label: 'NEO_LAVA' },
    { id: 'art', name: 'ARTIFACTS', icon: Palette, color: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.6)', label: 'CYBER_X' },
    { id: 'hard', name: 'HARDWARE', icon: Layers, color: '#a855f7', shadow: 'rgba(168, 85, 247, 0.6)', label: 'CORE_V2' },
    { id: 'luxe', name: 'CURATED', icon: Sparkles, color: '#f43f5e', shadow: 'rgba(16, 185, 129, 0.6)', label: 'VVIP_ID' },
];

export default function PrismVaultSlider() {
    const [active, setActive] = useState('all');

    return (
        <section className="relative overflow-hidden">

            <div className="relative z-10">
                <Swiper
                    slidesPerView={'auto'}
                    freeMode={true}
                    modules={[FreeMode]}
                    className="overflow-visible!"
                >
                    {CATEGORIES.map((cat) => (
                        <SwiperSlide key={cat.id} className="w-auto!">
                            <motion.div
                                whileTap={{ scale: 0.94 }}
                                onClick={() => setActive(cat.id)}
                                className="relative cursor-pointer py-2 mr-2"
                            >
                                {/* --- THE CHROMATIC GLASS CHAMBER --- */}
                                <div
                                    style={{
                                        backgroundColor: `${cat.color}15`, // 15% opacity tint
                                        borderColor: `${cat.color}40`,     // 40% opacity border
                                   
                                    }}
                                    className={`
                                    relative w-[130px] h-[120px] rounded-[50px] transition-all duration-700 border-[1.5px] backdrop-blur-md overflow-hidden
                                    ${active === cat.id ? '-translate-y-1 scale-100' : 'scale-95'}
                                `}>

                                    {/* INTERNAL REFRACTIVE GLOSS */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-transparent z-0" />

                                    {/* KINETIC LIGHT LEAK (Persistent on all cards) */}
                                    <motion.div
                                        animate={{ y: ['-100%', '200%'] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: Math.random() * 2 }}
                                        style={{ background: `linear-gradient(180deg, transparent, ${cat.color}22, transparent)` }}
                                        className="absolute inset-x-0  w-full skew-y-12 z-10 pointer-events-none"
                                    />

                                    {/* CONTENT HIERARCHY */}
                                    <div className="relative z-20 h-full py-[18px] flex flex-col items-center justify-between">

                                        {/* Serial/Technical ID */}
                                        <div className="flex flex-col items-center gap-1">
                                            <span
                                                style={{ color: cat.color }}
                                                className="text-[7px] font-mono font-black tracking-[0.2em]"
                                            >
                                                {cat.label}
                                            </span>
                                            <div className="h-[1px] w-4 bg-white/10" />
                                        </div>

                                        {/* The Icon Module */}
                                        <div
                                            style={{ backgroundColor: cat.color }}
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-2xl relative group"
                                        >
                                            <cat.icon size={22} strokeWidth={2.5} />
                                            {/* Inner Ring Glow */}
                                            <div className="absolute inset-[-4px] rounded-full border border-white/20 animate-pulse" />
                                        </div>

                                        {/* Title & Status */}
                                        <div className="flex flex-col items-center gap-1.5">
                                            <h3 className="text-[11px] font-black tracking-widest text-white mt-2 leading-none">
                                                {cat.name}
                                            </h3>

                                        </div>
                                    </div>

                                    {/* Bottom "Liquid" Level */}
                                    <div
                                        style={{ backgroundColor: cat.color }}
                                        className="absolute bottom-0 left-0 right-0 h-full opacity-40 shadow-[0_0_15px_#fff]"
                                    />
                                </div>

                                {/* Active Selection Halo */}
                                {active === cat.id && (
                                    <motion.div
                                        layoutId="activeHalo"
                                        style={{ backgroundColor: cat.color }}
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full blur-md opacity-60"
                                    />
                                )}
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}