/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Background from '@/components/Background';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle2, Ban, CheckCircle2, Search, Loader2, Lock, Users } from 'lucide-react';
import { useUserStore } from '@/app/store/userStore';

export default function AdminUsersPage() {
    // 1. Hook into the Zustand store
    const { users, isLoading, fetchUsers, updateUser } = useUserStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [telegramWebApp, setTelegramWebApp] = useState<any>(null);
    const [showBanConfirm, setShowBanConfirm] = useState<string | null>(null); // maps to user._id
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    useEffect(() => {
        // Load Telegram WebApp SDK
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            setTelegramWebApp(tg);
            tg.ready();
        }

        // 2. Initial Data Fetch
        fetchUsers();
    }, [fetchUsers]);

    // 3. Functional Ban Logic
    const handleToggleBan = async (userId: string) => {
        const userToUpdate = users.find(u => String(u._id) === String(userId));

        if (!userToUpdate) return;

        setActionLoadingId(userId);

        // Call the store's update action (hits your PUT /api/admin/users/[id])
        await updateUser(userId, { isBanned: !userToUpdate.isBanned });

        setActionLoadingId(null);
        setShowBanConfirm(null);

        if (telegramWebApp) telegramWebApp.notificationOccurred('success');
    };

    // 4. Dynamic Filtering
    const filteredUsers = users.filter(user => {
        const search = searchTerm.toLowerCase();
        return (
            user.username?.toLowerCase().includes(search) ||
            user.firstName.toLowerCase().includes(search) ||
            user.telegramId.toString().includes(search)
        );
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#01030d] to-[#04081c] text-white font-sans relative p-6 pb-24 overflow-hidden">
            <Background />
            <PageHeader title="USER_DIRECTORY" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative z-10 pt-20 space-y-6"
            >
                {/* Search Bar */}
                <motion.div variants={itemVariants} className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search by name, username, or TG ID..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/30 transition-all backdrop-blur-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                </motion.div>

                {isLoading && users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        <p className="animate-pulse">Accessing Encrypted Records...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20">
                        <Users size={48} className="mx-auto text-zinc-800 mb-4" />
                        <p className="text-zinc-500">No agents matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className={`bg-[#0c0c0c]/60 border rounded-2xl p-4 backdrop-blur-md relative transition-all duration-300
                                    ${user.isBanned ? 'border-rose-500/30' : 'border-white/5'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            {user.photoUrl ? (
                                                <img src={user.photoUrl} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" />
                                            ) : (
                                                <UserCircle2 size={40} className="text-zinc-700" />
                                            )}
                                            {user.isBanned && (
                                                <div className="absolute -top-1 -right-1 bg-rose-600 rounded-full p-0.5">
                                                    <Lock size={10} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold flex items-center gap-2">
                                                {user.firstName} {user.lastName || ''}
                                                
                                            </h3>
                                            <p className="text-[10px] text-zinc-500 font-mono">
                                                @{user.username || 'unknown'} • ID:{user.telegramId}
                                            </p>
                                        </div>
                                    </div>


                                    <button
                                        onClick={() => setShowBanConfirm(user._id!.toString())}
                                        disabled={String(actionLoadingId) === String(user._id)}
                                        className={`p-2.5 rounded-xl transition-all ${user.isBanned
                                            ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                            : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                                            }`}
                                    >
                                        {actionLoadingId === String(user._id) ? <Loader2 size={18} className="animate-spin" /> : (user.isBanned ? <CheckCircle2 size={18} /> : <Ban size={18} />)}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showBanConfirm && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowBanConfirm(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-white/10 p-6 rounded-3xl w-full max-w-sm relative z-10 text-center"
                        >
                            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Ban size={32} />
                            </div>
                            <h2 className="text-xl font-bold mb-2">Modify Access?</h2>
                            <p className="text-zinc-400 text-sm mb-6">Are you sure you want to change the status for this agent?</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowBanConfirm(null)} className="flex-1 py-3 rounded-xl bg-zinc-800 font-bold text-xs">CANCEL</button>
                                <button
                                    onClick={() => handleToggleBan(showBanConfirm)}
                                    className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs transition-colors"
                                >
                                    CONFIRM ACTION
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}