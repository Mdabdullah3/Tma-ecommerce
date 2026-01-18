/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, ShoppingBag,
     Lock, ShieldCheck,
    ScanBarcode, Wifi, Cpu, Activity
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import Background from '@/components/Background';
import MenuButton from '@/components/MenuButton';
import Link from 'next/link';
import SecurityGateModal from '@/components/SecurityGateModal';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';

export default function EliteProfile() {
    const [user, setUser] = useState({ name: "DIRECTOR_01", photo: "" });
    const [showAdminGate, setShowAdminGate] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
            WebApp.setHeaderColor('#000000');
            const tg = WebApp.initDataUnsafe?.user;
            if (tg) setUser({ name: tg.first_name.toUpperCase(), photo: tg.photo_url || "" });
        }
    }, []);

    if (isAdmin) return router.push('/admin');

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative pb-32">
            <Background />

            <PageHeader title="Elite Profile" />

            <main className="relative z-10 pt-20 px-4 space-y-6">

                {/* --- 1. THE PLATINUM ID CARD (Hero) --- */}
                <div className="relative w-full aspect-[1.7/1] group perspective-1000">
                    <motion.div
                        initial={{ rotateX: 5, opacity: 0 }}
                        animate={{ rotateX: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl"
                    >
                        {/* 1A. Background: Matte Black Metal */}
                        <div className="absolute inset-0 bg-[#0f0f0f]" />
                        <div className="absolute inset-0 opacity-[0.15] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                        {/* 1B. Holographic Sheen Animation */}
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                        />

                        {/* 1C. Content Layer */}
                        <div className="relative h-full p-6 flex flex-col justify-between z-10">

                            {/* Top: Chip & Signal */}
                            <div className="flex justify-between items-start">
                                {/* The "SIM" Chip (Gold) */}
                                <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-700 border border-yellow-400/50 relative overflow-hidden shadow-lg">
                                    <div className="absolute inset-0 opacity-50 border-r border-black/20 w-1/3" />
                                    <div className="absolute inset-0 opacity-50 border-r border-black/20 w-2/3" />
                                    <div className="absolute top-1/2 inset-x-0 h-[1px] bg-black/20" />
                                    <Cpu size={12} className="absolute inset-0 m-auto text-black/40 opacity-50" />
                                </div>

                                <div className="flex items-center gap-2 opacity-50">
                                    <Wifi size={14} />
                                    <span className="text-[8px] font-mono">5G_SECURE</span>
                                </div>
                            </div>

                            {/* Middle: Identity */}
                            <div className="flex items-end gap-4 pl-1">
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white/10 shadow-xl bg-zinc-800">
                                    {user.photo && <img src={user.photo} className="w-full h-full object-cover grayscale contrast-125" />}
                                </div>
                                <div className="flex flex-col mb-1">
                                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-0.5">Operative</span>
                                    <h1 className="text-xl font-black text-white uppercase tracking-wider leading-none">
                                        {user.name}
                                    </h1>
                                </div>
                            </div>

                            {/* Bottom: Metadata */}
                            <div className="flex justify-between items-end border-t border-white/5 pt-3">
                                <div className="flex flex-col">
                                    <span className="text-[7px] text-zinc-600 uppercase tracking-widest">Clearance</span>
                                    <span className="text-[10px] font-bold text-white">LEVEL_04</span>
                                </div>
                                <div className="flex items-center gap-2 opacity-30">
                                    <span className="text-[6px] font-mono">0921-X99</span>
                                    <ScanBarcode size={24} />
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>

                {/* --- 2. CONTROL GRID --- */}
                <section className="grid grid-cols-2 gap-3 pt-2">

                    {/* Big Button: Order History */}
                    <Link href="/profile/order-history" className="col-span-2">
                        <MenuButton
                            variant="large"
                            color="#d97706" // Deep Amber
                            icon={ShoppingBag}
                            name="Ledger"
                            subtitle="TRANSACTION HISTORY"
                        />
                    </Link>

                    {/* Left: Wallet */}
                    <Link href="/profile/wallet-connect">
                        <MenuButton
                            color="#0ea5e9" // Sky Blue
                            icon={Wallet}
                            name="Assets"
                            subtitle="WALLET LINK"
                        />
                    </Link>

                    {/* Right: Security */}
                    <Link href="#">
                        <MenuButton
                            color="#8b5cf6" // Violet
                            icon={ShieldCheck}
                            name="Security"
                            subtitle="2FA STATUS"
                        />
                    </Link>

                    {/* Full Width: Admin Vault */}
                    <div className="col-span-2 mt-4">
                        <motion.button
                            onClick={() => setShowAdminGate(true)}
                            whileTap={{ scale: 0.98 }}
                            className="relative w-full h-16 rounded-[24px] bg-[#0c0c0c] border border-dashed border-red-900 hover:bg-red-950/10 transition-all group flex items-center justify-center gap-3 overflow-hidden"
                        >
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                            <Lock size={14} className="text-zinc-600 group-hover:text-red-500 transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-red-500 transition-colors">
                                Access Admin Protocol
                            </span>
                        </motion.button>
                    </div>
                </section>

            </main>

            {/* Admin Modal */}
            <AnimatePresence>
                {showAdminGate && (
                    <SecurityGateModal
                        onClose={() => setShowAdminGate(false)}
                        onAdminAccess={() => setIsAdmin(true)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}