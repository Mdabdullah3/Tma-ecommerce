/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import Background from '@/components/Background';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Ban, CheckCircle2, Loader2,
    Users, ShieldAlert, ScanFace,
    Wifi,
    Scan,
    Fingerprint
} from 'lucide-react';
import { useUserStore } from '@/app/store/userStore';
import PageHeader from '@/components/PageHeader';

export default function AdminUsersPage() {
    const { users, isLoading, fetchUsers, updateUser } = useUserStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [telegramWebApp, setTelegramWebApp] = useState<any>(null);
    const [showBanConfirm, setShowBanConfirm] = useState<string | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            setTelegramWebApp(tg);
            tg.ready();
        }
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleBan = async (userId: string) => {
        const userToUpdate = users.find(u => String(u._id) === String(userId));
        if (!userToUpdate) return;

        setActionLoadingId(userId);
        telegramWebApp?.HapticFeedback.impactOccurred('heavy');

        await updateUser(userId, { isBanned: !userToUpdate.isBanned });

        setActionLoadingId(null);
        setShowBanConfirm(null);
        telegramWebApp?.HapticFeedback.notificationOccurred('success');
    };

    const filteredUsers = users.filter(user => {
        const search = searchTerm.toLowerCase();
        return (
            user.username?.toLowerCase().includes(search) ||
            user.firstName.toLowerCase().includes(search) ||
            user.telegramId.toString().includes(search)
        );
    });

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans relative pb-24 overflow-x-hidden selection:bg-emerald-500/30">
            <Background />
            <PageHeader title="Users Database" />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 pt-24 px-4 space-y-6"
            >
                {/* --- 2. NEURAL SEARCH BAR --- */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-linear-to-r from-emerald-500/20 via-purple-500/20 to-emerald-500/20 rounded-2xl opacity-50 blur-lg group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-[#0a0a0a]/90 border border-white/10 rounded-2xl flex items-center h-14 px-4 overflow-hidden shadow-2xl backdrop-blur-xl">
                        <Scan size={18} className="text-emerald-500 mr-3" />
                        <input
                            type="text"
                            placeholder="SCAN IDENTITY..."
                            className="bg-transparent flex-1 text-xs font-mono text-white placeholder:text-zinc-600 uppercase outline-none h-full tracking-widest"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="h-4 w-[1px] bg-white/10 mx-3" />
                        <span className="text-[9px] font-mono text-zinc-500">CMD_F</span>
                    </div>
                </div>

                {/* --- 3. THE AGENT GRID (Masonry Feel) --- */}
                <div className="space-y-4 pb-20">
                    {isLoading && users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-50">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-t-emerald-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin" />
                            </div>
                            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest animate-pulse">
                                Uplinking...
                            </span>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="py-24 border border-dashed border-zinc-800 rounded-[32px] flex flex-col items-center justify-center gap-4 opacity-30">
                            <Users size={32} />
                            <span className="text-[10px] font-mono uppercase tracking-widest">Database Empty</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredUsers.map((user, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: index * 0.05, type: "spring" }}
                                    className="group relative"
                                >
                                    {/* --- 3A. CARD CHASSIS --- */}
                                    <div className={`
                                        relative overflow-hidden rounded-[28px] border bg-[#080808] transition-all duration-300
                                        ${user.isBanned
                                            ? 'border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.1)]'
                                            : 'border-white/5 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]'}
                                    `}>
                                        {/* Background Grid & Noise */}
                                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                                        <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-[100px] pointer-events-none" />

                                        {/* BANNED OVERLAY (Diagonal Stripes) */}
                                        {user.isBanned && (
                                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(225,29,72,0.05)_10px,rgba(225,29,72,0.05)_20px)] z-0" />
                                        )}

                                        <div className="relative z-10 p-4 flex items-center gap-5">

                                            {/* --- 3B. THE HEX-AVATAR --- */}
                                            <div className="relative">
                                                {/* Rotating Data Ring */}
                                                <div className={`absolute -inset-2 border border-dashed rounded-full animate-[spin_8s_linear_infinite] ${user.isBanned ? 'border-rose-500/30' : 'border-emerald-500/30'}`} />

                                                {/* Hexagon Clip Mask */}
                                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-black relative z-10">
                                                    {user.photoUrl ? (
                                                        <img
                                                            src={user.photoUrl}
                                                            className={`w-full h-full object-cover ${user.isBanned ? 'grayscale contrast-150' : ''}`}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className={`w-full h-full flex items-center justify-center ${user.isBanned ? 'bg-rose-900 text-rose-500' : 'bg-zinc-800 text-zinc-500'}`}>
                                                            <ScanFace size={24} />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Status Badge */}
                                                <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border z-20 ${user.isBanned ? 'bg-rose-500 text-white border-rose-600' : 'bg-emerald-500 text-black border-emerald-400'}`}>
                                                    {user.isBanned ? 'DENIED' : 'ACTIVE'}
                                                </div>
                                            </div>

                                            {/* --- 3C. IDENTITY DATA --- */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-mono text-zinc-500 uppercase mb-0.5">Operative Name</span>
                                                        <h3 className={`text-base font-black uppercase tracking-tight truncate ${user.isBanned ? 'text-zinc-500 line-through decoration-rose-500' : 'text-white'}`}>
                                                            {user.firstName} {user.lastName}
                                                        </h3>
                                                    </div>
                                                    {/* Signal Strength Icon */}
                                                    <Wifi size={14} className={user.isBanned ? 'text-rose-900' : 'text-emerald-500'} />
                                                </div>

                                                <div className="mt-2 flex items-center gap-3">
                                                    <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-zinc-400">
                                                        @{user.username || 'UNKNOWN'}
                                                    </div>
                                                    <span className="text-[9px] font-mono text-zinc-600">
                                                        ID::{user.telegramId.toString().slice(0, 6)}..
                                                    </span>
                                                </div>
                                            </div>

                                            {/* --- 3D. THE KILL SWITCH (Action) --- */}
                                            <button
                                                onClick={() => setShowBanConfirm(user._id!.toString())}
                                                disabled={String(actionLoadingId) === String(user._id)}
                                                className={`
                                                    relative w-12 h-12 rounded-xl flex items-center justify-center transition-all overflow-hidden
                                                    ${user.isBanned
                                                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-black'
                                                        : 'bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white'}
                                                `}
                                            >
                                                {actionLoadingId === String(user._id) ? (
                                                    <Loader2 size={20} className="animate-spin" />
                                                ) : user.isBanned ? (
                                                    <CheckCircle2 size={20} />
                                                ) : (
                                                    <Ban size={20} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* --- 4. SECURITY OVERRIDE MODAL (Red Alert) --- */}
            <AnimatePresence>
                {showBanConfirm && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
                            onClick={() => setShowBanConfirm(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative w-full max-w-xs bg-[#0a0a0a] border-t-4 border-rose-600 rounded-[32px] p-8 shadow-[0_0_50px_rgba(225,29,72,0.2)] overflow-hidden"
                        >
                            {/* Animated Background Pulse */}
                            <div className="absolute inset-0 bg-gradient-to-b from-rose-900/20 to-transparent opacity-50" />
                            <div className="absolute top-0 inset-x-0 h-[1px] bg-rose-500 shadow-[0_0_20px_#e11d48]" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-6 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
                                    <ShieldAlert size={40} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-widest text-white mb-2">
                                    Override Protocol
                                </h2>
                                <p className="text-[10px] font-mono text-rose-200/60 uppercase tracking-wider mb-8 leading-relaxed">
                                    You are about to alter the security clearance level for this operative. This action is logged.
                                </p>

                                <div className="flex flex-col gap-3 w-full">
                                    <button
                                        onClick={() => handleToggleBan(showBanConfirm)}
                                        className="h-14 rounded-2xl bg-rose-600 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-rose-500 transition-all shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2"
                                    >
                                        <Fingerprint size={16} /> Confirm Action
                                    </button>
                                    <button
                                        onClick={() => setShowBanConfirm(null)}
                                        className="h-12 rounded-2xl bg-transparent border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}