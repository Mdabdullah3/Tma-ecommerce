/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet, Settings, ShoppingBag,
    Info, LogOut,
    ChevronRight,
    Fingerprint, Bell, Activity, Lock,
    MessageSquare,
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import Background from '@/components/Background';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';

export default function EliteProfile() {
    const [user, setUser] = useState({ name: "DIRECTOR_01", photo: "", id: "8820-X" });
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
            WebApp.setHeaderColor('#020617');
            const tg = WebApp.initDataUnsafe?.user;
            if (tg) {
                setUser({
                    name: tg.first_name.toUpperCase(),
                    photo: tg.photo_url || "",
                    id: `${tg.id.toString().slice(-4)}-PROT`
                });
            }
        }
    }, []);

    type MenuItem = {
        id: string;
        name: string;
        icon: React.ComponentType<any>;
        color: string;
        label?: string;
        status?: string;
        href?: string;
    };

    type MenuGroup = {
        group: string;
        items: MenuItem[];
    };

    const menuGroups: MenuGroup[] = [
        {
            group: "Acquisition_Sector",
            items: [
                { id: 'orders', name: 'Order Summary', icon: ShoppingBag, color: '#f59e0b', label: "ASSETS", href: "/profile/order-history" }, // Amber
                { id: 'wallet', name: 'Wallet Connect', icon: Wallet, color: '#fb923c', label: "TON", status: isConnected ? 'SYNCED' : 'LINK', href: "/profile/wallet-connect" }, // Orange
            ]
        },
        {
            group: "Security_Sector",
            items: [
                { id: 'settings', name: 'Identity Settings', icon: Settings, color: '#06b6d4', href: "/profile/identity-settings" }, // Cyan
            ]
        },
        {
            group: "Protocol_Sector",
            items: [
                { id: 'support', name: 'Priority Support', icon: MessageSquare, color: '#a855f7', href: "/" }, // Purple
                { id: 'about', name: 'About Store', icon: Info, color: '#10b981', href: "/" }, // Emerald
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-amber-500 overflow-x-hidden relative pb-24">
            <Background />
            <PageHeader title="PROFILE" />

            <main className="relative z-10 pt-20 px-6">

                {/* --- 1. THE MULTI-SPECTRAL HERO --- */}
                <section className="flex flex-col items-center mb-4">
                    <div className="relative mb-2">
                        {/* Dynamic Multicolor Aura */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 via-cyan-500 to-amber-500 blur-[80px] opacity-20 animate-pulse" />

                        <div className="relative w-24 h-24 rounded-[55px] p-[2px] bg-linear-to-b from-white/30 to-transparent shadow-2xl">
                            <div className="w-full h-full rounded-[54px] bg-[#050505] overflow-hidden border border-black relative">
                                {user.photo ? (
                                    <img src={user.photo} className="w-full h-full object-cover grayscale brightness-110 contrast-125" alt="U" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                                        <Fingerprint size={56} strokeWidth={1} className="text-white/10" />
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <h1 className="text-xl font-black tracking-tighter uppercase leading-none text-white">
                            {user.name}
                        </h1>
                    </div>
                </section>

                {/* --- 2. SPECTRAL ACTION LIST (Different Colors) --- */}
                <div className="space-y-6 pt-2">
                    {menuGroups.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-5">
                            {/* Group Header */}
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black tracking-[0.4em] text-zinc-500 uppercase  leading-none">{group.group}</span>
                                    <div className="h-[0.5px] w-8 bg-white/10" />
                                </div>
                                <Activity size={10} className="text-zinc-800" />
                            </div>

                            <div className="space-y-2">
                                {group.items.map((item) => (
                                    <Link href={item.href || "#"} key={item.id}>
                                        <motion.button
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => item.id === 'wallet' && setIsConnected(!isConnected)}
                                            className="relative w-full group overflow-hidden mt-3"
                                        >
                                            {/* COLORFUL BACKGROUND: Subtle tint of the item's unique color */}
                                            <div
                                                style={{ backgroundColor: `${item.color}08`, borderColor: `${item.color}20` }}
                                                className="absolute inset-0 border rounded-[35px] -z-10 group-hover:scale-105 transition-all duration-500"
                                            />

                                            <div className="p-3 flex items-center justify-between">
                                                <div className="flex items-center gap-5">
                                                    {/* SOLID COLOR ICON BOX */}
                                                    <div
                                                        style={{ backgroundColor: item.color }}
                                                        className="w-10 h-10 rounded-[24px] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-500"
                                                    >
                                                        <item.icon size={22} strokeWidth={2.5} />
                                                    </div>

                                                    <div className="flex flex-col items-start">
                                                        <span className="text-xs font-black  tracking-tighter uppercase text-white leading-none group-hover:text-white transition-colors">
                                                            {item.name}
                                                        </span>
                                                        
                                                    </div>
                                                </div>
                                                <div
                                                    style={{ backgroundColor: `${item.color}20` }}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/20 group-hover:text-white transition-all"
                                                >
                                                    <ChevronRight size={16} />
                                                </div>
                                            </div>
                                        </motion.button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* --- 3. THE TERMINATION TRIGGER (SOLID ROSE) --- */}
                    <div className="pt-10 flex flex-col items-center gap-8">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="group relative w-full h-20 rounded-[40px] bg-[#0c0c0c] border border-rose-900/30 flex items-center justify-center gap-4 overflow-hidden"
                        >
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-rose-600/5 group-hover:bg-rose-600 transition-all duration-700" />

                            <div className="relative z-10 w-10 h-10 rounded-xl bg-rose-600/20 flex items-center justify-center text-rose-500 group-hover:bg-white group-hover:text-rose-600 transition-all">
                                <LogOut size={20} />
                            </div>
                            <span className="relative z-10 text-xs font-black  tracking-widest uppercase text-rose-600 group-hover:text-white">
                                Logout
                            </span>
                        </motion.button>


                    </div>
                </div>
            </main>
        </div>
    );
}