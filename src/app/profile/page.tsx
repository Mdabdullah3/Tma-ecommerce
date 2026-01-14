/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, ShoppingBag,
    LogOut,
    Fingerprint,
    LockIcon,
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import Background from '@/components/Background';
import PageHeader from '@/components/PageHeader';
import MenuButton from '@/components/MenuButton';
import Link from 'next/link';
import SecurityGateModal from '@/components/SecurityGateModal';
import { useRouter } from 'next/navigation';

const MENU_ITEMS = [
    { id: 'orders', name: 'ORDER_SUMMARY', icon: ShoppingBag, color: '#f59e0b', href: '/profile/order-history' },
    { id: 'wallet', name: 'WALLET_CONNECT', icon: Wallet, color: '#06b6d4', status: 'UNLINKED', href: '/profile/wallet-connect' },
];

export default function EliteProfile() {
    const [user, setUser] = useState({ name: "DIRECTOR_01", photo: "" });
    const [showAdminGate, setShowAdminGate] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
            WebApp.setHeaderColor('#020617');
            const tg = WebApp.initDataUnsafe?.user;
            if (tg) setUser({ name: tg.first_name.toUpperCase(), photo: tg.photo_url || "" });
        }
    }, []);

    if (isAdmin) {
        return router.push('/admin');
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden relative pb-20">
            <Background />
            <PageHeader title="IDENTITY" />

            <main className="relative z-10 pt-20 px-6 space-y-6">
                {/* --- 1. HERO IDENTITY --- */}
                <section className="flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-3 group">
                        <div className="absolute inset-0 bg-amber-500/10 blur-[50px] animate-pulse" />
                        <div className="relative w-full h-full rounded-[45px] p-[2px] bg-gradient-to-b from-white/20 to-transparent shadow-2xl">
                            <div className="w-full h-full rounded-[43px] bg-zinc-950 overflow-hidden border border-black flex items-center justify-center">
                                {user.photo ? <img src={user.photo} className="w-full h-full object-cover grayscale" /> : <Fingerprint size={48} className="text-white/10" />}
                            </div>
                        </div>
                    </div>
                    <h1 className="text-xl font-black tracking-tighter uppercase">{user.name}</h1>
                </section>

                {/* --- 2. DYNAMIC MENU LIST --- */}
                <div className="space-y-3">
                    {MENU_ITEMS.map((item) => (
                        <Link key={item.id} href={item?.href || '#'}>
                            <MenuButton
                                color={item.color}
                                icon={item.icon}
                                name={item.name}
                            />
                        </Link>
                    ))}

                    <MenuButton
                        color="#ef4444"
                        icon={LockIcon}
                        name="ADMIN_ACCESS"
                        onClick={() => setShowAdminGate(true)}
                    />
                </div>
                <motion.button whileTap={{ scale: 0.96 }} className="w-full h-16 rounded-[35px] bg-[#0c0c0c] border border-rose-950/30 text-rose-600 font-black tracking-widest uppercase text-xs flex items-center justify-center gap-3">
                    <LogOut size={18} /> DISCONNECT
                </motion.button>
            </main>
            <AnimatePresence>
                {showAdminGate && <SecurityGateModal onClose={() => setShowAdminGate(false)} onAdminAccess={() => setIsAdmin(true)} />}
            </AnimatePresence>
        </div>
    );
}