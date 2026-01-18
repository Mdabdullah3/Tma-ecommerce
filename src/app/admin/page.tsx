"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Users, ShoppingBag,
    LogOut, Cpu,
    Globe, ArrowUpRight, Command
} from 'lucide-react';
import Background from '@/components/Background';
import Link from 'next/link';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ revenue: "0", users: "0", loading: true });

    useEffect(() => {
        // Simulate data fetch with a "boot up" sequence
        setTimeout(() => {
            setStats({
                revenue: "42,050",
                users: "1,204",
                loading: false
            });
        }, 800);
    }, []);

    const adminMenuItems = [
        { id: 'prod', name: 'Products', subtitle: 'INVENTORY', icon: ShoppingBag, color: '#f59e0b', href: '/admin/products', stat: '84 Items' },
        { id: 'user', name: 'Users', subtitle: 'DATABASE', icon: Users, color: '#3b82f6', href: '/admin/users', stat: '1.2k Active' },
        { id: 'tx', name: 'Ledger', subtitle: 'FINANCE', icon: Activity, color: '#10b981', href: '/admin/transactions', stat: '+24% Today' },
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans overflow-x-hidden relative pb-32 selection:bg-emerald-500/30">
            <Background />

            {/* --- 1. HOLLYWOOD-STYLE HEADER --- */}
            <header className="fixed top-0 inset-x-0 z-50 p-6 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1 opacity-50">
                        <Command size={12} />
                        <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Root_Access</span>
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight leading-none text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-600">
                        Overseer<span className="text-emerald-500">.</span>AI
                    </h1>
                </div>

                {/* Status Indicator */}
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                </div>
            </header>

            <main className="relative z-10 pt-28 px-4 space-y-6">

                {/* --- 2. THE "GOD MODE" CARD (Holographic) --- */}
                <section className="relative w-full aspect-[1.4/1] perspective-1000 group">
                    <motion.div
                        initial={{ rotateX: 10, opacity: 0, y: 50 }}
                        animate={{ rotateX: 0, opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="relative w-full h-full bg-[#080808] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl"
                    >
                        {/* 2A. Background FX */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 blur-[80px] rounded-full mix-blend-screen" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600/10 blur-[60px] rounded-full mix-blend-screen" />
                        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                        {/* 2B. Content Container */}
                        <div className="relative z-10 p-6 h-full flex flex-col justify-between">

                            {/* Top Stats Row */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                                        <Globe size={10} /> Network Velocity
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-5xl font-black text-white tracking-tighter"
                                        >
                                            {stats.revenue}
                                        </motion.span>
                                        <span className="text-lg font-bold text-zinc-500">TON</span>
                                    </div>
                                </div>
                            </div>

                            {/* Middle: Live Waveform */}
                            <div className="flex items-end justify-between h-12 gap-1 px-1 ">
                                {[30, 50, 45, 70, 40, 60, 80, 50, 70, 90, 60, 40, 30].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 10 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                                        className="w-full rounded-full bg-linear-to-t from-emerald-500/10 to-emerald-400"
                                    />
                                ))}
                            </div>

                            {/* Bottom: System Health */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-zinc-500 uppercase">CPU</span>
                                        <span className="text-[10px] font-bold text-emerald-400">12%</span>
                                    </div>
                                    <div className="w-px h-6 bg-white/10" />
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-zinc-500 uppercase">RAM</span>
                                        <span className="text-[10px] font-bold text-purple-400">4.2GB</span>
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                                        v2.4.0 Stable
                                    </span>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </section>

                {/* --- 3. CONTROL MATRIX (Grid Layout) --- */}
                <section>
                    <div className="flex items-center gap-2 mb-4 opacity-40">
                        <Cpu size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Subsystems
                        </span>
                        <div className="h-px flex-1 bg-white/20" />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {adminMenuItems.map((item, index) => (
                            <Link key={item.id} href={item.href}>
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative h-24 bg-[#0a0a0a] rounded-[24px] border border-white/5 overflow-hidden flex items-center justify-between p-1 pr-6 hover:border-white/10 transition-all"
                                >
                                    {/* Hover Glow */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                                        style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
                                    />

                                    {/* Left: Icon Block */}
                                    <div className="h-full w-24 rounded-[20px] bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:scale-95 transition-transform duration-300">
                                        <item.icon size={24} style={{ color: item.color }} />
                                    </div>

                                    {/* Middle: Text */}
                                    <div className="flex-1 pl-4 flex flex-col justify-center">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">
                                            {item.subtitle}
                                        </span>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tight">
                                            {item.name}
                                        </h3>
                                    </div>

                                    {/* Right: Stat & Arrow */}
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded">
                                            {item.stat}
                                        </span>
                                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 group-hover:bg-white group-hover:text-black transition-all">
                                            <ArrowUpRight size={16} />
                                        </div>
                                    </div>

                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* --- 4. EMERGENCY EXIT --- */}
                <Link href="/profile">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 h-16 rounded-[24px] bg-linear-to-r from-red-950/30 to-black border border-red-900/30 flex items-center justify-between px-6 group hover:border-red-500/50 transition-all"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-700 group-hover:text-red-500 transition-colors">
                            End_Session
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 border border-red-500/10 group-hover:bg-red-500 group-hover:text-white transition-all">
                            <LogOut size={18} />
                        </div>
                    </motion.button>
                </Link>

            </main>
        </div>
    );
};

export default AdminDashboard;