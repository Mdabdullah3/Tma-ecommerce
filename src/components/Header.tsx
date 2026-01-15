/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState, useRef } from 'react';
import WebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/app/store/userStore';

export default function SovereignHeader() {
    const [user, setUser] = useState({ name: "DIRECTOR_01", photo: "" });
    const [status, setStatus] = useState<'idle' | 'active'>('idle');
    const registerUser = useUserStore((state) => state.registerUser);
    const hasRegistered = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
            const tgUser = WebApp.initDataUnsafe?.user;
            if (tgUser) {
                setUser({
                    name: tgUser.first_name.toUpperCase(),
                    photo: tgUser.photo_url || ""
                });
                if (!hasRegistered.current) {
                    registerUser(tgUser);
                    hasRegistered.current = true;
                }
            }
        }
    }, [registerUser]);

    return (
        <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed top-0 inset-x-0 z-[100] px-6 pt-6 pb-2" // Increased z-index to 100
        >
            {/* Glassmorphism Background */}
            <div className="absolute inset-x-4 top-4 bottom-0 bg-white/5 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />

            <div className="relative z-10 flex items-center justify-between px-2">
                {/* --- LEFT: IDENTITY SECTION --- */}
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <motion.div
                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -inset-2 bg-blue-500/20 blur-xl rounded-full"
                        />
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/20 p-[1px] bg-zinc-900">
                            <Link href="/profile" className="w-full h-full rounded-full overflow-hidden block">
                                {user.photo ? (
                                    <img src={user.photo} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white">
                                        <User size={18} />
                                    </div>
                                )}
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] font-medium tracking-tight text-zinc-400 mb-0.5">Welcome to Swift</span>
                        <h2 className="text-xs font-black tracking-widest text-white truncate max-w-[120px]">
                            {user.name}
                        </h2>
                    </div>
                </div>

                {/* --- RIGHT: THE VAULT PILL --- */}
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setStatus(status === 'idle' ? 'active' : 'idle')}
                    className={`group relative flex items-center gap-3 pl-4 pr-5 py-2.5 rounded-full border transition-all duration-500 
                        ${status === 'active'
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-white border-white/20 hover:border-white/40'}`}
                >
                    <AnimatePresence mode="wait">
                        {status === 'active' ? (
                            <motion.div
                                key="active"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Shield size={12} strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase tracking-tighter">SECURE</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Wallet size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Connect</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.header>
    );
}