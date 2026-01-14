"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Users, ShoppingBag, PieChart, Database, Settings, BarChart, HardDrive, ShieldCheck, LogOut,
    CheckCircle2, TrendingUp, Cpu, Server, Lock
} from 'lucide-react';
import MenuButton from '@/components/MenuButton';
import Background from '@/components/Background';
import Link from 'next/link';

interface AdminDashboardProps {
    onTerminateAccess: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {

    const metrics = [
        { id: 'totalSales', name: 'TOTAL REVENUE', value: '$1.78M', icon: TrendingUp, color: 'linear-gradient(45deg, #f59e0b, #eab308)' },
        { id: 'totalUsers', name: 'ACTIVE USERS', value: '12,045', icon: Users, color: 'linear-gradient(45deg, #3b82f6, #2563eb)' },
        { id: 'cpuLoad', name: 'CPU LOAD', value: '38%', icon: Cpu, color: 'linear-gradient(45deg, #a855f7, #9333ea)' },
        { id: 'serverUptime', name: 'SERVER UPTIME', value: '99.98%', icon: Server, color: 'linear-gradient(45deg, #22c55e, #16a34a)' },
    ];

    const adminMenuItems = [
        { id: 'productmanagment', name: 'Products_Management', icon: ShoppingBag, color: '#f59e0b', href: '/admin/products' },
        { id: 'userDirectory', name: 'USER_DIRECTORY', icon: Users, color: '#2563eb', href: '/admin/users' },
        { id: 'transactionLog', name: 'TRANSACTION_LOGS', icon: ShoppingBag, color: '#eab308', href: '/admin/transactions' },
        { id: 'systemConfig', name: 'SYSTEM_CONFIG', icon: Settings, color: '#9333ea', href: '/admin/config' },
        { id: 'securityAudit', name: 'SECURITY_AUDIT', icon: Lock, color: '#ef4444', href: '/admin/security' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08, // Faster stagger for snappier feel
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0, scale: 0.95 },
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

    const glitchEffect = {
        filter: 'url(#glitch)', // Reference SVG filter for a glitch effect
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#01030d] to-[#04081c] text-white font-sans relative p-6 sm:p-8 md:p-10 pb-24 overflow-hidden">
            <Background />
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative z-10 flex flex-col items-center pt-3"
            >

                {/* Metric Cards Section - More visually engaging */}
                <motion.section variants={itemVariants} className="w-full mb-5">
                    <h2 className="text-sm font-bold text-center uppercase text-zinc-500 tracking-wider mb-4 px-2  pl-2">REALTIME_OVERVIEW</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {metrics.map((metric, index) => (
                            <motion.div
                                key={metric.id}
                                variants={itemVariants}
                                transition={{ delay: 0.1 * index }}
                                className="relative bg-[#0c0c0c]/30 border border-white/10 rounded-3xl p-3 flex flex-col items-start space-y-3
                                           shadow-xl backdrop-blur-md overflow-hidden
                                           hover:border-indigo-500/50 hover:bg-[#0c0c0c]/50 transition-all duration-300 cursor-pointer group"
                            >
                                {/* Subtle scanline effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.01] to-transparent animate-scanline pointer-events-none" />

                                <div className="flex items-center gap-3 text-zinc-400 relative z-10">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                                        <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.1 * index, type: "spring", stiffness: 300, damping: 10 }}
                                            className="text-white"
                                            style={{ background: metric.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                                        >
                                            <metric.icon size={20} strokeWidth={2} />
                                        </motion.div>
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                                        {metric.name}
                                    </span>
                                </div>
                                <span className="text-2xl font-extrabold italic text-white tracking-tight relative z-10">
                                    {metric.value}

                                </span>
                                {/* Animated border on hover */}
                                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-indigo-500/50 transition-all duration-300 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Admin Menu Section - Sleeker buttons */}
                <motion.section variants={itemVariants} className="w-full mb-12">
                    <h2 className="text-sm font-bold uppercase text-zinc-500 tracking-wider mb-4 px-2  pl-2">ADMIN_FUNCTIONS</h2>
                    <div className="space-y-4"> {/* Increased spacing */}
                        {adminMenuItems.map((item, index) => (
                            <Link key={item.id} href={item.href} >
                                <motion.div variants={itemVariants} transition={{ delay: 0.08 * index }}>
                                    <MenuButton
                                        // Use dynamic gradient for color
                                        color={item.color}
                                        icon={item.icon}
                                        name={item.name}
                                    />
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.section>

                {/* Terminate Access Button - More dramatic */}
                <motion.div variants={itemVariants} className="w-full">
                    <motion.button
                        whileTap={{ scale: 0.94 }}
                        // onClick={onTerminateAccess}
                        className="w-full h-14 rounded-[35px] bg-gradient-to-br from-rose-950/40 to-rose-900/60 border border-rose-800/50 text-rose-400 font-extrabold tracking-widest uppercase text-sm flex items-center justify-center gap-3
                                   shadow-2xl shadow-rose-900/30 hover:from-rose-800/50 hover:to-rose-900/70 active:shadow-inner active:shadow-rose-900/50 transition-all duration-300 relative overflow-hidden"
                    >
                        <LogOut size={20} className="relative z-10" />
                        <span className="relative z-10">DISCONNECT</span>
                        <span className="absolute inset-0 rounded-[35px] ring-2 ring-rose-600 opacity-0 group-hover:animate-pulse-light pointer-events-none" />
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;