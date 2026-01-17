'use client';

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface FloatingCartButtonProps {
    itemCount: number;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount }) => {
    const hasItems = itemCount > 0;

    return (
        <div className="fixed bottom-8 right-6 z-50">
            <Link href="/carts">
                <motion.button
                    initial={{ scale: 0, rotate: 10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group outline-none"
                >
                    {/* --- 1. THE GLOW (Emerald Green for Money/Success) --- */}
                    {hasItems && (
                        <motion.div
                            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 bg-emerald-500 blur-2xl rounded-full opacity-40"
                        />
                    )}

                    {/* --- 2. THE CHASSIS (Deep Black Glass) --- */}
                    <div className={`
                        relative flex items-center gap-3 pl-4 pr-1.5 h-14 rounded-full border backdrop-blur-2xl transition-all duration-500
                        ${hasItems
                            ? 'bg-[#0a0a0a] border-emerald-500/30 shadow-[0_10px_40px_rgba(16,185,129,0.2)] w-auto'
                            : 'bg-black/40 border-white/10 w-14 justify-center pr-0 pl-0'}
                    `}>

                        {/* Top Reflection Line */}
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        {/* --- 3. THE ICON --- */}
                        <div className="relative">
                            <ShoppingBag
                                size={20}
                                className={`transition-colors duration-300 ${hasItems ? 'text-emerald-400' : 'text-white/60'}`}
                                strokeWidth={2.5}
                            />
                            {/* Notification Dot (Red pulse when empty to encourage buying, or hidden) */}
                            {hasItems && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_currentColor]" />
                            )}
                        </div>

                        {/* --- 4. EXPANDED DATA (Checkout Mode) --- */}
                        <AnimatePresence>
                            {hasItems && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0, x: -10 }}
                                    animate={{ width: 'auto', opacity: 1, x: 0 }}
                                    exit={{ width: 0, opacity: 0, x: -10 }}
                                    className="flex items-center gap-4 overflow-hidden whitespace-nowrap"
                                >
                                    {/* Vertical Divider */}
                                    <div className="w-[1px] h-6 bg-white/10" />

                                    {/* Text Info */}
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Total_Items</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-base font-black text-white tracking-tight">
                                                {itemCount < 10 ? `0${itemCount}` : itemCount}
                                            </span>
                                            <span className="text-[9px] font-bold text-emerald-500">ASSETS</span>
                                        </div>
                                    </div>

                                    {/* THE "GO" BUTTON (White vs Green Contrast) */}
                                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-black shadow-lg shadow-white/10">
                                        <ArrowRight size={18} strokeWidth={3} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.button>
            </Link>
        </div>
    );
};

export default FloatingCartButton;