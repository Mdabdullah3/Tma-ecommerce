/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Headset, MessageSquare, BookOpen, Bug, Flame, Search, CheckCircle2, Loader2, Rocket, Zap, XCircle, ChevronRight
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import Background from '@/components/Background'; // Deep, textured dark background
import PageHeader from '@/components/PageHeader'; // Minimal, transparent header
import Link from 'next/link';

// Mock data for active tickets and knowledge base
const MOCK_ACTIVE_TICKETS = [
    { id: 'SYS-TKT-001-A', subject: 'Login Authentication Glitch', status: 'Pending Agent', progress: 60, color: '#FF7F00' }, // Vibrant Orange
    { id: 'SYS-TKT-002-B', subject: 'NFT Transfer Protocol Stuck', status: 'In Review', progress: 90, color: '#00FFFF' }, // Electric Cyan
    { id: 'SYS-TKT-003-C', subject: 'Transaction Confirmation Delay', status: 'New Request', progress: 10, color: '#EE00FF' }, // Cyber Pink/Magenta
];

// Limiting knowledge base to 3-4 for mini app as requested
const MOCK_KNOWLEDGE_BASE_CATEGORIES = [
    { name: 'Identity & Access', icon: Zap, color: '#FF7F00', articles: 12 },
    { name: 'Net-Transaction Protocol', icon: Rocket, color: '#00FFFF', articles: 8 },
    { name: 'Digital Asset Registry', icon: BookOpen, color: '#00FF00', articles: 15 },
    // { name: 'System Malfunctions', icon: Bug, color: '#EE00FF', articles: 5 }, // Excluded for brevity
];

export default function SupportPage() {
    const [agentStatus, setAgentStatus] = useState<'online' | 'offline'>('online');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredKnowledgeBase, setFilteredKnowledgeBase] = useState(MOCK_KNOWLEDGE_BASE_CATEGORIES);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            WebApp.ready();
            WebApp.expand();
            WebApp.setHeaderColor('#020617');
            const interval = setInterval(() => {
                setAgentStatus(prev => (prev === 'online' ? 'offline' : 'online'));
            }, 10000);
            return () => clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredKnowledgeBase(MOCK_KNOWLEDGE_BASE_CATEGORIES);
        } else {
            setFilteredKnowledgeBase(
                MOCK_KNOWLEDGE_BASE_CATEGORIES.filter(cat =>
                    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery]);

    const handleNewMission = (type: 'chat' | 'ticket') => {
        WebApp.showPopup({
            message: `Initiating new ${type} mission...`,
        });
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-['Oxanium',sans-serif] selection:bg-[#EE00FF] overflow-x-hidden relative pb-24">
            {/* Background should be a deep, textured black, possibly with subtle grid/circuit patterns */}
            <Background />
            <PageHeader title="SUPPORT_PROTOCOL" />

            <main className="relative z-10 pt-24 px-3 space-y-5 md:space-y-7"> {/* Even tighter spacing */}

                {/* --- 1. MISSION CONTROL STATUS (Holographic Console Display) --- */}
                <section className="relative p-4 rounded-xl backdrop-blur-md bg-white/5 shadow-lg shadow-black/50 overflow-hidden flex items-center gap-4 group">
                    {/* Pulsating outline defined by light, not border */}
                    <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                            boxShadow: `0 0 15px -3px ${agentStatus === 'online' ? '#00FF00' : '#FF7F00'}`,
                        }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {/* Top edge subtle glow */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <motion.div
                        className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-black/70 to-black/30 shadow-inner shadow-white/10" // Darker, more layered icon background
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        {agentStatus === 'online' ? (
                            <Headset size={28} strokeWidth={1.5} className="text-[#00FF00]" />
                        ) : (
                            <MessageSquare size={28} strokeWidth={1.5} className="text-[#FF7F00]" />
                        )}
                    </motion.div>
                    <div className="relative z-10 flex flex-col items-start">
                        <motion.h2
                            key={agentStatus}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`text-lg font-extrabold tracking-tight uppercase ${agentStatus === 'online' ? 'text-[#00FF00]' : 'text-[#FF7F00]'}`}
                        >
                            {agentStatus === 'online' ? "AGENTS_ONLINE" : "OFFLINE_PROTOCOL"}
                        </motion.h2>
                        <p className="text-xs text-zinc-400 font-light opacity-80">
                            {agentStatus === 'online' ? "Your direct line to operational support." : "System standby. Protocol offline."}
                        </p>
                    </div>
                </section>

                {/* --- 2. INITIATE NEW MISSION (Interactive Holographic Buttons) --- */}
                <section>
                    <div className="flex items-center gap-3 px-1 mb-2">
                        <span className="text-[8px] font-bold tracking-[0.4em] text-white/50 leading-none">INITIATE_NEW_MISSION</span>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleNewMission('chat')}
                            className="relative p-4 rounded-lg backdrop-blur-md bg-[#00FFFF]/10 shadow-lg shadow-[#00FFFF]/10 overflow-hidden group hover:shadow-2xl hover:shadow-[#00FFFF]/20 transition-all duration-300"
                        >
                            {/* Inner glow on hover */}
                            <div className="absolute inset-0 bg-[#00FFFF]/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            {/* Scanner line animation on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FFFF]/30 to-transparent animate-scanner-glow opacity-0 group-hover:opacity-100" />

                            <MessageSquare size={24} className="relative z-10 text-[#00FFFF] mb-1" />
                            <span className="relative z-10 text-sm font-extrabold uppercase text-white tracking-tight leading-none">LIVE_COMMS</span>
                            <span className="relative z-10 text-[8px] text-zinc-400 uppercase tracking-widest opacity-80">REAL-TIME_ASSIST</span>
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleNewMission('ticket')}
                            className="relative p-4 rounded-lg backdrop-blur-md bg-[#EE00FF]/10 shadow-lg shadow-[#EE00FF]/10 overflow-hidden group hover:shadow-2xl hover:shadow-[#EE00FF]/20 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-[#EE00FF]/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EE00FF]/30 to-transparent animate-scanner-glow opacity-0 group-hover:opacity-100" />

                            <Headset size={24} className="relative z-10 text-[#EE00FF] mb-1" />
                            <span className="relative z-10 text-sm font-extrabold uppercase text-white tracking-tight leading-none">DATA_LOG</span>
                            <span className="relative z-10 text-[8px] text-zinc-400 uppercase tracking-widest opacity-80">SUBMIT_REQUEST</span>
                        </motion.button>
                    </div>
                </section>

                {/* --- 3. ACTIVE MISSIONS (Dynamic Status Trackers) --- */}
                {MOCK_ACTIVE_TICKETS.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 px-1 mb-2">
                            <span className="text-[8px] font-bold tracking-[0.4em] text-white/50 leading-none">ACTIVE_MISSIONS</span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>
                        <div className="space-y-2">
                            {MOCK_ACTIVE_TICKETS.map((ticket, index) => (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 20 }}
                                    className="relative p-3 rounded-lg backdrop-blur-md bg-white/5 shadow-md shadow-black/40 overflow-hidden group"
                                >
                                    {/* Accent line on left (not a border, but an illuminated edge) */}
                                    <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: ticket.color }} />
                                    {/* Holographic glowing line at the bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--ticket-color)] to-transparent" style={{ '--ticket-color': ticket.color } as React.CSSProperties} />

                                    <div className="flex justify-between items-center mb-1 pl-2">
                                        <span className="text-[9px] font-mono text-white/60 uppercase tracking-wider">{ticket.id}</span>
                                        <span className="text-[9px] font-bold uppercase" style={{ color: ticket.color }}>{ticket.status}</span>
                                    </div>
                                    <h3 className="text-sm font-extrabold uppercase text-white tracking-tight pl-2 mb-2 leading-tight">{ticket.subject}</h3>

                                    {/* Progress bar with glitch effect */}
                                    <div className="w-full bg-white/10 rounded-full h-1 pl-2 relative overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${ticket.progress}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                            className="h-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-[var(--ticket-color)] to-[var(--ticket-color)]"
                                            style={{ '--ticket-color': ticket.color } as React.CSSProperties}
                                        >
                                            <div className="absolute inset-y-0 right-0 w-2 bg-white/20 animate-glitch-pulse" /> {/* Glitch effect */}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* --- 4. INTEL DATABASE (Modular Access Panels - 3 items) --- */}
                <section>
                    <div className="flex items-center gap-3 px-1 mb-2">
                        <span className="text-[8px] font-bold tracking-[0.4em] text-white/50 leading-none">INTEL_DATABASE</span>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    {/* Search Bar - Sleek, integrated look */}
                    <motion.div
                        className="relative bg-black/40 rounded-full pl-4 pr-3 py-2.5 shadow-inner shadow-black/50 group mb-3 flex items-center gap-2"
                        whileFocus={{ boxShadow: '0 0 15px -3px #FF7F00' }} // Focus glow
                    >
                        <Search size={16} className="text-white/40 group-focus-within:text-[#FF7F00] transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH_INTEL_STREAM..."
                            className="bg-transparent flex-1 text-sm font-medium tracking-wide text-white outline-none placeholder:text-white/20 placeholder:font-light"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSearchQuery('')}
                                className="text-white/40 hover:text-white"
                            >
                                <XCircle size={14} />
                            </motion.button>
                        )}
                    </motion.div>

                    <div className="grid grid-cols-2 gap-3">
                        <AnimatePresence>
                            {filteredKnowledgeBase.map((category, index) => (
                                <motion.button
                                    key={category.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.06, type: "spring", stiffness: 200, damping: 20 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative p-4 rounded-lg backdrop-blur-md bg-white/5 shadow-lg shadow-black/40 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                                >
                                    {/* Corner accent glow */}
                                    <div className="absolute top-0 right-0 w-3 h-3 rounded-bl-full blur-sm" style={{ backgroundColor: category.color }} />
                                    {/* Subtle internal glow on hover */}
                                    <div className="absolute inset-0 bg-white/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at center, ${category.color}10 0%, transparent 70%)` }} />

                                    <category.icon size={20} style={{ color: category.color }} className="mb-1 relative z-10" />
                                    <h4 className="text-sm font-extrabold uppercase text-white tracking-tight relative z-10 leading-tight">{category.name}</h4>
                                    <span className="text-[8px] text-zinc-400 uppercase tracking-widest relative z-10 opacity-80">{category.articles} DATA_UNITS</span>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* --- 5. URGENT PROTOCOL (Critical Alert Panel) --- */}
                <section>
                    <div className="flex items-center gap-3 px-1 mb-2">
                        <span className="text-[8px] font-bold tracking-[0.4em] text-white/50 leading-none">URGENT_PROTOCOL</span>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="relative w-full p-4 rounded-lg backdrop-blur-md bg-red-600/20 shadow-lg shadow-red-500/30 overflow-hidden group hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300"
                    >
                        {/* Intense red glow on hover */}
                        <div className="absolute inset-0 bg-red-500/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {/* Pulsating red border-like shadow */}
                        <motion.div
                            className="absolute inset-0 rounded-lg"
                            style={{ boxShadow: '0 0 20px -5px #EF4444' }}
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        <Flame size={24} className="relative z-10 text-red-400" />
                        <div className="flex flex-col items-start relative z-10">
                            <span className="text-sm font-extrabold uppercase text-white tracking-tight leading-tight">CRITICAL_ALERT_LINE</span>
                            <span className="text-[9px] text-zinc-300 uppercase tracking-widest opacity-80">SYSTEM_FAILURE_ONLY</span>
                        </div>
                    </motion.button>
                </section>

                {/* --- Footer branding --- */}
                <div className="mt-8 py-5 flex flex-col items-center text-center space-y-2 opacity-30">
                    <Headset size={24} className="text-white/20" />
                    <p className="text-[8px] font-bold tracking-widest text-white/30 uppercase italic">OPERATIONAL_LOG_INTEGRATED</p>
                </div>
            </main>
        </div>
    );
}