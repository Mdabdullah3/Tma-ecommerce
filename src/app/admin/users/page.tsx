/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Background from '@/components/Background';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle2, Ban, CheckCircle2, Search, Loader2, Calendar, Lock, Users } from 'lucide-react';

interface User {
    id: string;
    telegramId: string;
    username: string;
    firstName: string;
    lastName?: string;
    lastActive: string; // ISO date string
    isBanned: boolean;
    isAdmin: boolean; // Useful to prevent banning other admins
}

// Dummy user data
const dummyUsers: User[] = [
    { id: 'user001', telegramId: '12345678', username: 'crypto_dev', firstName: 'Crypto', lastActive: '2023-11-15T14:30:00Z', isBanned: false, isAdmin: false },
    { id: 'user002', telegramId: '87654321', username: 'nft_enthusiast', firstName: 'NFT', lastActive: '2023-11-15T10:00:00Z', isBanned: false, isAdmin: false },
    { id: 'user003', telegramId: '11223344', username: 'virtual_investor', firstName: 'Virtual', lastActive: '2023-11-14T18:45:00Z', isBanned: true, isAdmin: false },
    { id: 'user004', telegramId: '55667788', username: 'digital_art_lover', firstName: 'Digital', lastActive: '2023-11-13T09:15:00Z', isBanned: false, isAdmin: false },
    { id: 'user005', telegramId: '99887766', username: 'admin_01', firstName: 'Admin', lastActive: '2023-11-15T15:00:00Z', isBanned: false, isAdmin: true },
];

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [telegramWebApp, setTelegramWebApp] = useState<any>(null); // State for WebApp
    const [showBanConfirm, setShowBanConfirm] = useState<string | null>(null); // userId to confirm ban
    const [actionLoading, setActionLoading] = useState<string | null>(null); // userId currently being acted on

    useEffect(() => {
        // Dynamically load WebApp SDK
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
            setTelegramWebApp(window.Telegram.WebApp);
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }

        // Simulate fetching users
        const fetchUsers = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
            setUsers(dummyUsers); // Replace with actual API call
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const handleToggleBan = async (userId: string) => {
        const userToUpdate = users.find(u => u.id === userId);
        if (!userToUpdate || userToUpdate.isAdmin) {
            if (telegramWebApp) telegramWebApp.showAlert('Cannot ban an administrator.', () => { });
            else alert('Cannot ban an administrator.');
            return;
        }

        setActionLoading(userId);
        // Simulate API call to update user status
        await new Promise(resolve => setTimeout(resolve, 500));

        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, isBanned: !user.isBanned } : user
            )
        );
        setActionLoading(null);
        setShowBanConfirm(null); // Close confirm modal
        if (telegramWebApp) telegramWebApp.notificationOccurred('success');
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telegramId.includes(searchTerm)
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0, scale: 0.98 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 150,
                damping: 15,
                mass: 0.8
            }
        }
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
                        placeholder="Search users by username, ID..."
                        className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg py-3 px-10 focus:outline-none focus:border-primary-accent transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                </motion.div>

                {loading ? (
                    <motion.div variants={itemVariants} className="text-center text-zinc-500 py-10">
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="inline-block"
                        >
                            <Loader2 size={24} />
                        </motion.span>
                        <p className="mt-2">Loading users...</p>
                    </motion.div>
                ) : filteredUsers.length === 0 ? (
                    <motion.div variants={itemVariants} className="text-center text-zinc-500 py-10">
                        <Users size={48} className="mx-auto text-zinc-700 mb-4" />
                        <h3 className="text-lg font-bold">No Users Found</h3>
                        <p className="text-sm">Adjust your search or add new users.</p>
                    </motion.div>
                ) : (
                    <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial="hidden"
                                animate="visible"
                                variants={itemVariants}
                                transition={{ delay: 0.05 * index }}
                                className={`bg-[#0c0c0c]/50 border rounded-xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden
                                           ${user.isBanned ? 'border-rose-700/50' : 'border-white/10'}
                                           hover:border-primary-accent/50 hover:shadow-primary-accent/20 transition-all duration-300 group`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.01] to-transparent animate-scanline pointer-events-none" />

                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <UserCircle2 size={24} className={`
                                            ${user.isAdmin ? 'text-primary-light' :
                                                user.isBanned ? 'text-rose-500' : 'text-zinc-400'}`} />
                                        <div>
                                            <h3 className="text-base font-bold text-white uppercase tracking-wider">
                                                {user.username} {user.isAdmin && <span className="text-primary-accent text-xs ml-1">(ADMIN)</span>}
                                            </h3>
                                            <p className="text-xs text-zinc-500">TG ID: {user.telegramId}</p>
                                        </div>
                                    </div>
                                    {user.id !== "user005" && !user.isAdmin && ( // Prevent banning dummy admin or other admins
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setShowBanConfirm(user.id)}
                                            disabled={actionLoading === user.id}
                                            className={`p-2 rounded-full text-white transition-colors
                                                        ${user.isBanned ? 'bg-green-600 hover:bg-green-700' : 'bg-rose-600 hover:bg-rose-700'}
                                                        ${actionLoading === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            title={user.isBanned ? 'Unban User' : 'Ban User'}
                                        >
                                            {actionLoading === user.id ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : user.isBanned ? (
                                                <CheckCircle2 size={20} />
                                            ) : (
                                                <Ban size={20} />
                                            )}
                                        </motion.button>
                                    )}
                                </div>

                                <div className="text-xs text-zinc-400 space-y-1 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-zinc-500" />
                                        <span>Last Active: {new Date(user.lastActive).toLocaleString()}</span>
                                    </div>
                                    {user.isBanned && (
                                        <p className="text-rose-500 flex items-center gap-1 font-medium">
                                            <Lock size={14} /> Account Banned
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {/* Ban Confirmation Modal */}
            <AnimatePresence>
                {showBanConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setShowBanConfirm(null)} // Close on outside click
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl max-w-xs w-full text-center relative"
                            onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
                        >
                            <h3 className="text-xl font-bold text-rose-500 mb-2">Confirm Ban</h3>
                            <p className="text-zinc-400 text-sm mb-6">
                                Are you sure you want to {users.find(u => u.id === showBanConfirm)?.isBanned ? 'unban' : 'ban'} user @{users.find(u => u.id === showBanConfirm)?.username}?
                            </p>
                            <div className="flex gap-3 mt-6">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowBanConfirm(null)}
                                    className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-zinc-900/40"
                                >
                                    CANCEL
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => showBanConfirm && handleToggleBan(showBanConfirm)}
                                    className="flex-1 bg-gradient-to-br from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-900/30"
                                    disabled={actionLoading === showBanConfirm}
                                >
                                    {actionLoading === showBanConfirm ? (
                                        <Loader2 size={20} className="animate-spin mx-auto" />
                                    ) : (
                                        users.find(u => u.id === showBanConfirm)?.isBanned ? 'UNBAN' : 'BAN'
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}