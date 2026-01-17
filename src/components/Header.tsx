/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from 'react';
import WebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Wallet, ScanFace } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/app/store/userStore';
import { useTonConnectUI, useTonWallet, useTonAddress } from "@tonconnect/ui-react";

export default function SovereignHeader() {
    const [user, setUser] = useState({ name: "DIRECTOR_01", photo: "" });
    const [balance, setBalance] = useState<string | null>(null);
    const registerUser = useUserStore((state) => state.registerUser);
    const hasRegistered = useRef(false);

    const wallet = useTonWallet();
    const address = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();

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
            // Ideally navigate to a wallet details page or disconnect
            tonConnectUI.disconnect();
        }
    };

    return (
        <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 inset-x-0 z-50 pt-4 px-4"
        >
            {/* Glass Container */}
            <div className="relative bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-full px-1.5 py-1.5 shadow-2xl flex items-center justify-between">

                {/* --- IDENTITY SECTION --- */}
                <Link href="/profile" className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full hover:bg-white/5 transition-colors">
                    <div className="relative">
                        {/* Avatar Ring */}
                        <div className="absolute -inset-1 rounded-full border border-dashed border-zinc-600 animate-[spin_10s_linear_infinite]" />
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 relative z-10">
                            {user.photo ? (
                                <img src={user.photo} className="w-full h-full object-cover" alt="User" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                    <User size={14} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase leading-none mb-0.5">Operative</span>
                        <span className="text-[11px] font-bold text-white tracking-wide uppercase truncate max-w-[100px]">
                            {user.name}
                        </span>
                    </div>
                </Link>

                {/* --- WALLET / ACTION SECTION --- */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWalletClick}
                    className={`
                        relative overflow-hidden rounded-full py-2 px-4 flex items-center gap-2 border transition-all duration-300
                        ${wallet
                            ? 'bg-zinc-900 border-zinc-700 text-white'
                            : 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'}
                    `}
                >
                    <AnimatePresence mode="wait">
                        {wallet ? (
                            <motion.div
                                key="connected"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2"
                            >
                                <div className="flex flex-col items-end leading-none">
                                    <span className="text-[10px] font-mono text-zinc-400">BALANCE</span>
                                    <span className="text-xs font-black tracking-tight">{balance ?? "0.00"} TON</span>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                    <Shield size={10} className="text-emerald-400" />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="connect"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2"
                            >
                                <span className="text-[10px] font-black tracking-widest uppercase">Connect</span>
                                <Wallet size={12} strokeWidth={3} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.header>
    );
}