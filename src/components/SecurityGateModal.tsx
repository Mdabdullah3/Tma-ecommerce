/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, X, Delete,
    ScanFace, Lock, AlertOctagon, Fingerprint
} from 'lucide-react';

interface SecurityGateModalProps {
    onClose: () => void;
    onAdminAccess: () => void;
}

const SecurityGateModal: React.FC<SecurityGateModalProps> = ({ onClose, onAdminAccess }) => {
    const [pin, setPin] = useState('');
    const [status, setStatus] = useState<'idle' | 'scanning' | 'error' | 'success'>('idle');
    const [telegramWebApp, setTelegramWebApp] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            setTelegramWebApp(window.Telegram.WebApp);
        }
    }, []);

    const handleNumClick = (num: string) => {
        if (pin.length < 4 && status !== 'scanning') {
            setPin(prev => prev + num);
            telegramWebApp?.HapticFeedback.selectionChanged();
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setStatus('idle');
        telegramWebApp?.HapticFeedback.selectionChanged();
    };

    useEffect(() => {
        if (pin.length === 4) {
            validatePin();
        }
    }, [pin]);

    const validatePin = async () => {
        setStatus('scanning');

        setTimeout(() => {
            if (pin === '1234') {
                setStatus('success');
                telegramWebApp?.HapticFeedback.notificationOccurred('success');
                setTimeout(() => {
                    onAdminAccess();
                    onClose();
                }, 800);
            } else {
                setStatus('error');
                telegramWebApp?.HapticFeedback.notificationOccurred('error');
                setTimeout(() => {
                    setPin('');
                    setStatus('idle');
                }, 1000);
            }
        }, 1200); // Slightly longer for dramatic effect
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
        >
            {/* 1. LUXURY BACKDROP */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            {/* 2. THE MODAL (Floating Glass Monolith) */}
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                className="relative w-full max-w-sm bg-[#050505] rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl border-t border-white/10"
            >
                {/* Ambient Red Glow (Security Theme) */}
                <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[150%] h-[50%] bg-rose-900/30 blur-[100px] rounded-full pointer-events-none" />

                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all z-20"
                >
                    <X size={16} />
                </button>

                {/* --- HEADER: HOLOGRAPHIC SCANNER --- */}
                <div className="relative flex flex-col items-center pt-8 mb-8 z-10">

                    {/* The Icon Container */}
                    <div className="relative mb-6">
                        {/* Spinning Ring Animation */}
                        <AnimatePresence>
                            {status === 'scanning' && (
                                <motion.div
                                    initial={{ opacity: 0, rotate: 0 }}
                                    animate={{ opacity: 1, rotate: 360 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-4 rounded-full border border-dashed border-rose-500/50"
                                />
                            )}
                        </AnimatePresence>

                        <motion.div
                            animate={status === 'error' ? { x: [-5, 5, -5, 5, 0] } : {}}
                            className={`
                                w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-xl border-2 transition-all duration-500 shadow-2xl
                                ${status === 'error' ? 'bg-rose-500/10 border-rose-500 text-rose-500 shadow-rose-900/50' :
                                    status === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-emerald-900/50' :
                                        status === 'scanning' ? 'bg-white/5 border-white/20 text-white' :
                                            'bg-[#0f0f0f] border-[#222] text-zinc-500'}
                            `}
                        >
                            {status === 'scanning' ? <ScanFace size={32} /> :
                                status === 'error' ? <AlertOctagon size={32} /> :
                                    status === 'success' ? <Lock size={32} /> :
                                        <Fingerprint size={32} />}
                        </motion.div>
                    </div>

                    {/* Text Status */}
                    <motion.div layout className="flex flex-col items-center gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${status === 'error' ? 'text-rose-500' : 'text-zinc-500'}`}>
                            {status === 'scanning' ? 'Biometric Scan' :
                                status === 'error' ? 'Auth Failed' :
                                    'Security Clearance'}
                        </span>
                        <h2 className="text-xl font-medium tracking-tight text-white">
                            {status === 'error' ? 'Try Again' : 'Enter Passcode'}
                        </h2>
                    </motion.div>
                </div>

                {/* --- PIN DOTS (Liquid Glass) --- */}
                <div className="flex justify-center gap-6 mb-10 z-10 relative">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="relative w-3 h-3">
                            <div className="absolute inset-0 rounded-full bg-zinc-800" />
                            <AnimatePresence>
                                {pin.length > i && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className={`absolute inset-0 rounded-full shadow-[0_0_10px_currentColor] ${status === 'error' ? 'bg-rose-500 text-rose-500' : 'bg-white text-white'}`}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* --- LIQUID KEYPAD --- */}
                <div className="grid grid-cols-3 gap-y-6 gap-x-6 px-8 pb-10 z-10 relative">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <LiquidKey
                            key={num}
                            num={num.toString()}
                            onClick={() => handleNumClick(num.toString())}
                            disabled={status === 'scanning'}
                        />
                    ))}

                    <div className="pointer-events-none" /> {/* Spacer */}

                    <LiquidKey num="0" onClick={() => handleNumClick('0')} disabled={status === 'scanning'} />

                    <button
                        onClick={handleDelete}
                        className="flex items-center justify-center h-16 w-16 text-zinc-500 active:text-white transition-colors"
                    >
                        <Delete size={24} />
                    </button>
                </div>

            </motion.div>
        </motion.div>
    );
};

// --- SUB-COMPONENT: PREMIUM LIQUID KEY ---
const LiquidKey = ({ num, onClick, disabled }: { num: string, onClick: () => void, disabled: boolean }) => (
    <motion.button
        whileTap={{ scale: 0.9, backgroundColor: "rgba(255,255,255,0.15)" }}
        onClick={onClick}
        disabled={disabled}
        className="
            relative h-16 w-16 mx-auto rounded-full flex items-center justify-center 
            bg-[#111] border border-[#222] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]
            group transition-all duration-300
        "
    >
        <span className="text-2xl font-light text-white group-active:scale-90 transition-transform">{num}</span>
    </motion.button>
);

export default SecurityGateModal;