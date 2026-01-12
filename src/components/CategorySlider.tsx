'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, Shirt, Palette, Layers, Headphones,
    Zap, Cpu, Radio, Target, Activity
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

const CATEGORIES = [
    { id: 'all', name: 'GENESIS', icon: Star, tier: 'S-01', power: 98, status: 'SYNCED' },
    { id: 'wear', name: 'APPAREL', icon: Shirt, tier: 'A-04', power: 72, status: 'ACTIVE' },
    { id: 'art', name: 'ARTIFACTS', icon: Palette, tier: 'X-02', power: 45, status: 'LOADED' },
    { id: 'hard', name: 'HARDWARE', icon: Layers, tier: 'B-09', power: 88, status: 'LINKED' },
    { id: 'acc', name: 'ACCESS', icon: Headphones, tier: 'C-07', power: 61, status: 'ONLINE' },
];

const CategorySlider: React.FC = () => {
    const [active, setActive] = useState('all');

    return (
        <section className="relative overflow-hidden">


            {/* --- KINETIC ARTEFACT SLIDER --- */}
            <div className="relative z-10 px-4">
                <Swiper
                    slidesPerView={'auto'}
                    spaceBetween={16}
                    freeMode={true}
                    modules={[FreeMode]}
                    className="overflow-visible!"
                >
                    {CATEGORIES.map((cat) => (
                        <SwiperSlide key={cat.id} className="!w-auto">
                            <motion.div
                                whileTap={{ scale: 0.92, rotate: -1 }}
                                onClick={() => setActive(cat.id)}
                                className="relative cursor-pointer group py-2"
                            >
                                {/* --- THE BLACK-LABEL CASE --- */}
                                <div className={`
                                    relative w-[145px] h-[105px] rounded-[32px] transition-all duration-1000 overflow-hidden border-[1px]
                                    ${active === cat.id
                                        ? 'bg-rose-500/10 border-rose-500/40 shadow-[0_20px_50px_rgba(244,63,94,0.15)]'
                                        : 'bg-white/[0.01] border-white/[0.05] grayscale-[0.8] hover:grayscale-0 hover:border-white/20'}
                                `}>

                                    {/* INTERNAL CARBON FIBER TEXTURE (Subtle) */}
                                    <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

                                    {/* HOLOGRAPHIC LIGHT LEAK */}
                                    <AnimatePresence>
                                        {active === cat.id && (
                                            <motion.div
                                                initial={{ opacity: 0, x: '-100%' }}
                                                animate={{ opacity: 1, x: '100%' }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/10 to-transparent skew-x-12 z-0"
                                            />
                                        )}
                                    </AnimatePresence>

                                    {/* CONTENT LAYER */}
                                    <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className={`p-2 rounded-xl transition-all duration-700 ${active === cat.id ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/5 text-zinc-600'}`}>
                                                <cat.icon size={16} />
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-[7px] font-mono font-black mb-0.5 ${active === cat.id ? 'text-rose-400' : 'text-zinc-800'}`}>
                                                    {cat.tier}
                                                </p>
                                                <div className={`h-[2px] w-4 ml-auto rounded-full ${active === cat.id ? 'bg-rose-500' : 'bg-zinc-900'}`} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-black tracking-[0.1em] uppercase transition-all ${active === cat.id ? 'text-white' : 'text-zinc-500'}`}>
                                                    {cat.name}
                                                </span>
                                                <span className="text-[6px] font-bold text-zinc-700 tracking-widest">{cat.status}</span>
                                            </div>

                                            
                                        </div>
                                    </div>
                                </div>

                                {/* ACTIVE ORBITAL INDICATOR */}
                                {active === cat.id && (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-rose-500 rounded-full shadow-[0_0_15px_#f43f5e]"
                                    />
                                )}
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* --- REFRACTIVE EDGE FADES --- */}
            <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .text-outline { -webkit-text-stroke: 1px #f43f5e; color: transparent; }
            `}</style>
        </section>
    );
};

export default CategorySlider;