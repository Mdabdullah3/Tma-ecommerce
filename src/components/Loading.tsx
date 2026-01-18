"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hexagon, Zap } from 'lucide-react';

const LOADING_STEPS = [
    "INITIALIZING_CORE...",
    "ESTABLISHING_SECURE_LINK...",
    "SYNCING_ASSET_DATA...",
    "DECRYPTING_METADATA...",
    "VERIFYING_SIGNATURES..."
];

const Loading = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-[#021709] flex flex-col items-center justify-center overflow-hidden">

            {/* 1. AMBIENT BACKGROUND FX */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-600/20 via-[#021704] to-[#041702]" />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* 2. THE REACTOR (Centerpiece) */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-12">

                {/* Glow Behind */}
                <div className="absolute inset-0 bg-emerald-500/30 blur-[50px] rounded-full animate-pulse" />

                {/* Outer Ring (Slow Spin) */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-white/10 rounded-full border-t-emerald-500/50 border-r-transparent"
                />

                {/* Middle Ring (Fast Reverse Spin) */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border-2 border-dashed border-emerald-500/30 rounded-full"
                />

                {/* Inner Core (Breathing) */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative z-10 bg-[#0a0a0a] w-16 h-16 rounded-xl border border-emerald-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                    <Hexagon size={24} className="text-emerald-400 fill-emerald-400/20" strokeWidth={1.5} />
                </motion.div>
            </div>

            {/* 3. TERMINAL TEXT (Dynamic) */}
            <div className="h-8 flex items-center justify-center relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                    >
                        <Zap size={12} className="text-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-[0.2em]">
                            {LOADING_STEPS[currentStep]}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 4. PROGRESS BAR */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-75"
                />
            </div>
        </div>
    );
};

export default Loading;