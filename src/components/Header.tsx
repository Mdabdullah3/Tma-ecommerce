/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from 'react';
import WebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/app/store/userStore';
import { useTonConnectUI, useTonWallet, useTonAddress } from "@tonconnect/ui-react";

export default function SovereignHeader() {
    const [user, setUser] = useState({ name: "DIRECTOR_01", photo: "" });
    const [balance, setBalance] = useState<string | null>(null);
    const registerUser = useUserStore((state) => state.registerUser);
    const hasRegistered = useRef(false);

    // TON Real-time Hooks
    const wallet = useTonWallet();
    const address = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();

    // 1. Fetch Balance Logic
    useEffect(() => {
        const fetchBalance = async () => {
            if (!address) {
                setBalance(null);
                return;
            }
            try {
                const response = await fetch(`https://toncenter.com/api/v2/getAddressInformation?address=${address}`);
                const data = await response.json();
                if (data.ok) {
                    const nanoTon = parseInt(data.result.balance);
                    const ton = (nanoTon / 1000000000).toFixed(2);
                    setBalance(ton);
                }
            } catch (err) {
                console.error("Balance fetch failed", err);
            }
        };

        fetchBalance();
        // Refresh balance every 30 seconds
        const interval = setInterval(fetchBalance, 30000);
        return () => clearInterval(interval);
    }, [address]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
            const tgUser = WebApp.initDataUnsafe?.user;
            if (tgUser) {
                setUser({
                    name: tgUser.username || `${tgUser.first_name || ""} ${tgUser.last_name || ""}`.trim() || "DIRECTOR_01",
                    photo: tgUser.photo_url || ""
                });
                if (!hasRegistered.current) {
                    registerUser(tgUser);
                    hasRegistered.current = true;
                }
            }
        }
    }, [registerUser]);

    const handleWalletClick = () => {
        if (!wallet) {
            tonConnectUI.openModal();
        } else {
            window.location.href = "/wallet";
        }
    };

    return (
        <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed top-0 inset-x-0 z-[100] px-6 pt-6 pb-2"
        >
            <div className="absolute inset-x-4 top-4 bottom-0 bg-white/5 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />

            <div className="relative z-10 flex items-center justify-between px-2">
                {/* --- LEFT: IDENTITY --- */}
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
                        <span className="text-[10px] font-medium tracking-tight text-zinc-400 mb-0.5 uppercase italic">Welcome</span>
                        <h2 className="text-xs font-black tracking-widest text-white truncate max-w-[120px]">
                            {user.name}
                        </h2>
                    </div>
                </div>

                {/* --- RIGHT: SMART VAULT PILL (SHOWS BALANCE) --- */}
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleWalletClick}
                    className={`group relative flex items-center gap-3 pl-4 pr-5 py-2.5 rounded-full border transition-all duration-500 
                        ${wallet
                            ? 'bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)]'
                            : 'bg-transparent text-white border-white/20 hover:border-white/40'}`}
                >
                    <AnimatePresence mode="wait">
                        {wallet ? (
                            <motion.div
                                key="active"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[11px] font-black italic tracking-tighter">
                                    {balance ?? "..."} <span className="text-[8px] opacity-60">TON</span>
                                </span>
                                <Shield size={10} strokeWidth={3} className="ml-1 opacity-40" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Wallet size={12} className="opacity-60" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Connect</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.header>
    );
}