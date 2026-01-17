'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface MenuButtonProps {
    color: string;
    icon: React.ElementType;
    name: string;
    subtitle?: string;
    onClick?: () => void;
    variant?: 'large' | 'default';
}

const MenuButton: React.FC<MenuButtonProps> = ({
    color, icon: Icon, name, subtitle = "ACCESS", onClick, variant = 'default'
}) => {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                relative group overflow-hidden border p-5 flex flex-col justify-between text-left
                transition-all duration-500
                ${variant === 'large'
                    ? 'h-40 rounded-[32px] bg-[#0c0c0c] border-[#1f1f1f]'
                    : 'h-36 rounded-[28px] bg-[#0a0a0a] border-[#1a1a1a]'}
            `}
        >
            {/* 1. TEXTURE LAYER (Noise) */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* 2. HOVER GLOW (Subtle Spotlight) */}
            <div
                className="absolute -right-10 -top-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                style={{ backgroundColor: color }}
            />

            {/* 3. ICON BOX */}
            <div className="flex justify-between items-start relative z-10">
                <div
                    className="w-11 h-11 rounded-[14px] flex items-center justify-center border border-white/5 shadow-inner transition-colors duration-300"
                    style={{ backgroundColor: `${color}10` }} // 10% opacity color
                >
                    <Icon size={20} style={{ color: color }} />
                </div>

                {/* Arrow Button */}
                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-zinc-600 group-hover:text-white group-hover:border-white/20 transition-all">
                    <ArrowUpRight size={14} />
                </div>
            </div>

            {/* 4. TYPOGRAPHY */}
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-400">
                        Active
                    </span>
                </div>

                <span className="block text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1 group-hover:text-zinc-500 transition-colors">
                    {subtitle}
                </span>
                <span className="block text-lg font-bold text-white uppercase tracking-tight leading-none group-hover:scale-105 origin-left transition-transform">
                    {name.replace('_', ' ')}
                </span>
            </div>
        </motion.button>
    );
};

export default MenuButton;