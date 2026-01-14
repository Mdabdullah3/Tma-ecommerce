// components/AdminDashboard.tsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity, Users, ShoppingBag, PieChart, Settings, BarChart, HardDrive, ShieldCheck, LogOut,
    CheckCircle2 // This one is from your original admin_active screen
} from 'lucide-react';
import MenuButton from '@/components/MenuButton';

interface AdminDashboardProps {
    onTerminateAccess: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onTerminateAccess }) => {

    // Dummy data for metrics
    const metrics = [
        { id: 'totalSales', name: 'TOTAL SALES', value: '$1.2M', icon: ShoppingBag, color: '#f59e0b' },
        { id: 'totalUsers', name: 'TOTAL USERS', value: '8,451', icon: Users, color: '#3b82f6' },
        { id: 'activeSessions', name: 'ACTIVE SESSIONS', value: '320', icon: Activity, color: '#10b981' },
        { id: 'systemHealth', name: 'SYSTEM HEALTH', value: '99.9%', icon: ShieldCheck, color: '#ef4444' }, // Adjusted color for alert-like status
    ];

    // Admin menu items using your MenuButton structure
    const adminMenuItems = [
        { id: 'userManagement', name: 'USER MANAGEMENT', icon: Users, color: '#3b82f6', action: () => alert('Opening User Management...') },
        { id: 'salesReports', name: 'SALES REPORTS', icon: BarChart, color: '#f59e0b', action: () => alert('Generating Sales Report...') },
        { id: 'dataInsights', name: 'DATA INSIGHTS', icon: PieChart, color: '#a855f7', action: () => alert('Accessing Data Insights...') },
        { id: 'serverStatus', name: 'SERVER STATUS', icon: HardDrive, color: '#10b981', action: () => alert('Checking Server Status...') },
        { id: 'globalSettings', name: 'GLOBAL SETTINGS', icon: Settings, color: '#ef4444', action: () => alert('Adjusting Global Settings...') },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans relative p-6 sm:p-8 md:p-10 pb-24 overflow-hidden">
            {/* Subtle Glowing Background Effect */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-1/4 left-1/2 w-80 h-80 bg-green-500 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-indigo-500 rounded-full mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative z-10 flex flex-col items-center pt-10"
            >
                {/* Admin Header */}
                <motion.div variants={itemVariants} className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4
                                   shadow-[0_0_80px_#22c55e] border border-green-300"
                    >
                        <CheckCircle2 size={40} className="text-black" strokeWidth={3} />
                    </motion.div>
                    <h1 className="text-4xl font-black italic uppercase mb-2 text-white tracking-wider">
                        ADMIN_ACTIVE
                    </h1>
                    <p className="text-[10px] font-mono text-zinc-500 tracking-[0.4em] mb-4">
                        CORE_PROTOCOL_UNLOCKED
                    </p>
                </motion.div>

                {/* Metric Cards Section */}
                <motion.section variants={itemVariants} className="w-full mb-12">
                    <h2 className="text-sm font-bold italic uppercase text-zinc-400 tracking-wider mb-4 px-2">OVERVIEW</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {metrics.map((metric, index) => (
                            <motion.div
                                key={metric.id}
                                variants={itemVariants}
                                transition={{ delay: 0.1 * index }}
                                className="bg-[#0c0c0c]/40 border border-white/5 rounded-2xl p-4 flex flex-col items-start space-y-2
                                           shadow-lg backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <metric.icon size={16} strokeWidth={2} style={{ color: metric.color }} />
                                    <span className="text-[9px] font-bold uppercase tracking-wider">{metric.name}</span>
                                </div>
                                <span className="text-2xl font-black italic text-white tracking-tight">{metric.value}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Admin Menu Section */}
                <motion.section variants={itemVariants} className="w-full mb-12">
                    <h2 className="text-sm font-bold italic uppercase text-zinc-400 tracking-wider mb-4 px-2">ADMIN_MENU</h2>
                    <div className="space-y-3">
                        {adminMenuItems.map((item, index) => (
                            <motion.div variants={itemVariants} key={item.id} transition={{ delay: 0.1 * index }}>
                                <MenuButton
                                    color={item.color}
                                    icon={item.icon}
                                    name={item.name}
                                    onClick={item.action}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Terminate Access Button */}
                <motion.div variants={itemVariants} className="w-full">
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={onTerminateAccess}
                        className="w-full h-16 rounded-[35px] bg-[#0c0c0c]/60 border border-rose-950/30 text-rose-600 font-black italic tracking-widest uppercase text-xs flex items-center justify-center gap-3
                                   shadow-xl hover:bg-rose-950/40 transition-colors"
                    >
                        <LogOut size={18} /> TERMINATE_ACCESS
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;