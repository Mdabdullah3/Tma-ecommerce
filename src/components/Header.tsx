"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Wallet } from 'lucide-react';

export default function SovereignHeader() {
    const [user, setUser] = useState({ name: "DIRECTOR_01", photo: "" });
    const [status, setStatus] = useState<'idle' | 'active'>('idle');

    useEffect(() => {
        // 2. Import the SDK inside useEffect (Client-side only)
        const initWebApp = async () => {
            const WebApp = (await import('@twa-dev/sdk')).default;

            WebApp.ready();
            WebApp.expand();
            WebApp.setHeaderColor('#000000');

            const tg = WebApp.initDataUnsafe?.user;
            if (tg) {
                setUser({
                    name: tg.first_name.toUpperCase(),
                    photo: tg.photo_url || ""
                });
            }
        };

        initWebApp();
    }, []);
    return (
        <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed top-0 inset-x-0 z-100 px-6 pt-6 pb-2"
        >
            {/* 1. LAYERED DEPTH: Glassmorphism Background */}
            <div className="absolute inset-x-4 top-4 bottom-0 bg-white/3 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />

            <div className="relative z-10 flex items-center justify-between px-4">

                {/* --- LEFT: IDENTITY SECTION --- */}
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        {/* Animated Aura */}
                        <motion.div
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -inset-2 bg-gradient-to-tr from-rose-500 to-transparent blur-xl rounded-full"
                        />
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border-[0.5px] border-white/30 p-[2px]">
                            <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 shadow-inner">
                                {user.photo ? (
                                    <img src={user.photo} className="w-full h-full object-cover scale-110 grayscale" alt="U" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User size={16} className="text-zinc-500" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[9px] font-medium tracking-tighter text-zinc-500 mb-0.5">Welcome to Swift</span>
                        <h2 className="text-xs font-bold tracking-widest text-white/90">
                            {user.name}
                        </h2>
                    </div>
                </div>

                {/* --- RIGHT: THE VAULT PILL --- */}
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setStatus(status === 'idle' ? 'active' : 'idle')}
                    className={`group relative flex items-center gap-3 pl-4 pr-5 py-2.5 rounded-full overflow-hidden border transition-all duration-500 
                        ${status === 'active'
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-white border-white/10 hover:border-white/30'}`}
                >
                    <AnimatePresence mode="wait">
                        {status === 'active' ? (
                            <motion.div
                                key="active"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Shield size={12} strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-tighter">SECURE</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Wallet size={12} className="text-zinc-400 group-hover:text-white transition-colors" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Connect</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.header>
    );
}