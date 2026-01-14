/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Fingerprint } from 'lucide-react';
import WebApp from '@twa-dev/sdk';


interface SecurityGateModalProps {
    onClose: () => void;
    onAdminAccess: () => void;
}

const SecurityGateModal: React.FC<SecurityGateModalProps> = ({ onClose, onAdminAccess }) => {
    const [passkey, setPasskey] = useState("");
    const [error, setError] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const MASTER_KEY = "8820";
    useEffect(() => {
        if (passkey.length === MASTER_KEY.length) {
            handleVerify();
        }
    }, [passkey]);

    const handleVerify = async () => {
        setVerifying(true);
        setError(false);

        // Simulate "System Processing"
        await new Promise(resolve => setTimeout(resolve, 800));

        if (passkey === MASTER_KEY) {
            WebApp.HapticFeedback.notificationOccurred('success');
            onAdminAccess();
        } else {
            WebApp.HapticFeedback.notificationOccurred('error');
            setError(true);
            setPasskey(""); 
            setTimeout(() => setError(false), 2000);
        }
        setVerifying(false);
    };

    const handleKeypadInput = (key: string) => {
        if (verifying || error) return;
        if (key === 'CLR') {
            setPasskey("");
        } else if (passkey.length < MASTER_KEY.length) {
            WebApp.HapticFeedback.impactOccurred('light');
            setPasskey(prev => prev + key);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
        >
            {/* TERMINAL CHASSIS */}
            <motion.div
                // --- 0.1% GENIUS HACK: THE ERROR SHAKE ---
                animate={error ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } } : {}}
                className={`relative w-full max-w-sm p-8 rounded-[40px] border-[1.5px] transition-colors duration-500 flex flex-col items-center
                    ${error ? 'border-rose-600 bg-rose-950/10 shadow-[0_0_50px_rgba(225,29,72,0.2)]' : 'border-white/10 bg-[#0a0a0a]/60 shadow-2xl'}`}
            >
                {/* Header Section */}
                <div className="text-center space-y-3 mb-10">
                    <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border transition-all duration-500
                        ${error ? 'bg-rose-500 border-rose-400 text-white rotate-12' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                        {error ? <ShieldAlert size={32} /> : <Fingerprint size={32} className={verifying ? "animate-pulse" : ""} />}
                    </div>
                    <div>
                        <h2 className={`text-xl font-black italic tracking-tighter uppercase ${error ? 'text-rose-500' : 'text-white'}`}>
                            {error ? 'Access_Denied' : verifying ? 'Verifying...' : 'Sovereign_Gate'}
                        </h2>
                        <p className="text-[7px] font-bold text-zinc-600 tracking-[0.4em] uppercase mt-1">Identity_Protocol_v.2.0</p>
                    </div>
                </div>

                {/* PASSKEY INDICATORS */}
                <div className="flex gap-4 mb-10">
                    {[...Array(MASTER_KEY.length)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-12 h-16 rounded-2xl border transition-all duration-300 flex items-center justify-center
                                ${error ? 'border-rose-500 bg-rose-500/10' :
                                    passkey.length > i ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-white/5 bg-white/5'}`}
                        >
                            <motion.div
                                animate={passkey.length > i ? { scale: [1, 1.5, 1] } : {}}
                                className={`w-2 h-2 rounded-full ${error ? 'bg-rose-500' : passkey.length > i ? 'bg-amber-500' : 'bg-zinc-800'}`}
                            />
                        </div>
                    ))}
                </div>

                {/* INDUSTRIAL KEYPAD */}
                <div className="grid grid-cols-3 gap-3 w-full">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "0", "X"].map((key) => (
                        <motion.button
                            key={key}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => key === 'X' ? onClose() : handleKeypadInput(key)}
                            className={`h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all
                                ${key === 'X' ? 'bg-rose-500/10 text-rose-500' : 'bg-white/5 border border-white/5 text-white/80 hover:bg-white/10'}`}
                        >
                            {key}
                        </motion.button>
                    ))}
                </div>

                {/* ERROR MESSAGE HUD */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="absolute -bottom-12 flex items-center gap-2"
                        >
                            <div className="w-1 h-1 rounded-full bg-rose-500 animate-ping" />
                            <span className="text-[8px] font-black tracking-widest text-rose-500 uppercase">Warning: Illegal_Access_Attempt_Logged</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default SecurityGateModal;