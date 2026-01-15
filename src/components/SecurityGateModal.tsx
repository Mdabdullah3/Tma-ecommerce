/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SecurityGateModal.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Fingerprint } from 'lucide-react';
// import WebApp from '@twa-dev/sdk'; // REMOVE THIS DIRECT IMPORT

interface SecurityGateModalProps {
    onClose: () => void;
    onAdminAccess: () => void;
}

const SecurityGateModal: React.FC<SecurityGateModalProps> = ({ onClose, onAdminAccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [telegramWebApp, setTelegramWebApp] = useState<any>(null); // State for WebApp

    // Dynamically load WebApp SDK
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
            setTelegramWebApp(window.Telegram.WebApp);
        }
    }, []);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (error) setError('');
    };

    const handleAccessAttempt = () => {
        if (password === 'ADMIN_PASS_123') { // Replace with a more secure check in production
            if (telegramWebApp) { // Use conditionally
                telegramWebApp.HapticFeedback.notificationOccurred('success');
            }
            onAdminAccess();
            onClose();
        } else {
            setError('ACCESS DENIED. INVALID PASSKEY.');
            if (telegramWebApp) { // Use conditionally
                telegramWebApp.HapticFeedback.notificationOccurred('error');
            }
            setPassword(''); // Clear password on error
        }
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Use a ref for the modal content to detect clicks outside
    const modalRef = useRef<HTMLDivElement>(null);

    const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={handleBackgroundClick}
        >
            <motion.div
                ref={modalRef}
                initial={{ y: -50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center relative"
            >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-rose-600 p-3 rounded-full shadow-lg shadow-rose-600/30">
                    <ShieldAlert size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-rose-500 mt-6 mb-2 uppercase">ADMIN ACCESS</h2>
                <p className="text-zinc-400 text-sm mb-6">Enter the passkey to gain privileged access.</p>

                <div className="relative mb-4">
                    <input
                        type="password"
                        placeholder="••••••••"
                        className={`w-full bg-zinc-800 text-white border-2 ${error ? 'border-rose-500' : 'border-zinc-700'} rounded-lg py-3 px-4 focus:outline-none focus:border-primary-accent text-lg text-center font-mono tracking-widest`}
                        value={password}
                        onChange={handlePasswordChange}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleAccessAttempt();
                            }
                        }}
                    />
                    <Fingerprint size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-rose-500 text-xs font-semibold mb-4"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                <div className="flex gap-3 mt-6">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-zinc-900/40"
                    >
                        CANCEL
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAccessAttempt}
                        className="flex-1 bg-linear-to-br from-primary-accent to-fuchsia-700 hover:from-primary-accent/90 hover:to-fuchsia-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary-accent/30"
                    >
                        PROCEED
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SecurityGateModal;