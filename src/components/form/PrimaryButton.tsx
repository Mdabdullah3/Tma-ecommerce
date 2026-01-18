"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';
interface PrimaryButtonProps extends React.ComponentPropsWithoutRef<typeof motion.button> {
    label: string;
    icon?: React.ElementType;
    isLoading?: boolean;
}
const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, icon: Icon, isLoading, disabled, ...props }) => {
    return (
        <>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || disabled}
                className={`
                relative w-full h-16 rounded-[20px] flex items-center justify-center gap-3 overflow-hidden group
                ${disabled ? 'bg-zinc-900 cursor-not-allowed opacity-50' : 'bg-white cursor-pointer'}
            `}
                {...props}
            >
                <div className="absolute inset-0 bg-linear-to-r from-emerald-400 via-white to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <div className={`
                absolute inset-[2px] rounded-2xl flex items-center justify-center gap-3 z-10 transition-colors
                ${disabled ? 'bg-zinc-900' : 'bg-black group-hover:bg-zinc-900'}
            `}>
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 text-zinc-400"
                            >
                                <Loader2 size={18} className="animate-spin" />
                                <span className="text-[10px] font-black tracking-[0.2em]">INITIALIZING...</span>
                            </motion.div>
                        ) : (
                            <div className="flex items-center gap-3">
                                {Icon && <Icon size={18} className="text-white group-hover:text-emerald-400 transition-colors" />}
                                <span className="text-xs font-black text-white uppercase tracking-[0.2em] group-hover:text-emerald-400 transition-colors">
                                    {label}
                                </span>
                                <ArrowRight size={16} className="text-zinc-600 group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.button>
        </>
    );
};

export default PrimaryButton;