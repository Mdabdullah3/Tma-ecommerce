/* eslint-disable react-hooks/purity */
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Shirt, Palette, Layers, Sparkles, Cpu } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

const CATEGORIES = [
    { id: 'all', name: 'GENESIS', icon: Star, color: '#10b981', num: '01' },
    { id: 'wear', name: 'APPAREL', icon: Shirt, color: '#f59e0b', num: '02' },
    { id: 'art', name: 'ARTIFACTS', icon: Palette, color: '#3b82f6', num: '03' },
    { id: 'hard', name: 'HARDWARE', icon: Cpu, color: '#d946ef', num: '04' },
    { id: 'luxe', name: 'VIP_ONLY', icon: Sparkles, color: '#f43f5e', num: '05' },
];

export default function CategorySlider() {
    const [active, setActive] = useState('all');

    return (
        <section className="relative z-20 py-3">

            <Swiper
                slidesPerView={'auto'}
                spaceBetween={10}
                freeMode={true}
                modules={[FreeMode]}
                className="!pl-0 !overflow-visible"
            >
                {CATEGORIES.map((cat) => {
                    const isActive = active === cat.id;

                    return (
                        <SwiperSlide key={cat.id} className="!w-auto">
                            <button
                                onClick={() => setActive(cat.id)}
                                className="relative outline-none group"
                            >
                                <div className={`
                                    relative flex items-center gap-3 px-5 py-3 rounded-full border transition-all duration-300
                                    ${isActive
                                        ? 'bg-white border-white translate-y-0'
                                        : 'bg-zinc-900/50 border-white/10 hover:border-white/20 hover:bg-zinc-800 translate-y-1'}
                                `}>

                                    {/* --- ACTIVE INDICATOR (The only glow) --- */}
                                    {isActive && (
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full blur-[4px]"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                    )}

                                    {/* --- ICON --- */}
                                    <div className={`
                                        flex items-center justify-center w-5 h-5 transition-colors duration-300
                                        ${isActive ? 'text-black' : 'text-zinc-500'}
                                    `}>
                                        <cat.icon size={16} strokeWidth={isActive ? 3 : 2} />
                                    </div>

                                    {/* --- TEXT --- */}
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className={`
                                            text-[10px] font-black tracking-[0.15em] uppercase leading-none transition-colors
                                            ${isActive ? 'text-black' : 'text-zinc-400'}
                                        `}>
                                            {cat.name}
                                        </span>
                                        {/* Sub-label (01, 02) */}
                                        <span className={`
                                            text-[7px] font-mono font-medium leading-none
                                            ${isActive ? 'text-zinc-500' : 'text-zinc-700'}
                                        `}>
                                            SERIES_{cat.num}
                                        </span>
                                    </div>

                                    {/* --- COLORED DOT (Subtle Status) --- */}
                                    <div
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isActive ? 'scale-100' : 'scale-0'}`}
                                        style={{ backgroundColor: cat.color }}
                                    />
                                </div>
                            </button>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </section>
    );
}