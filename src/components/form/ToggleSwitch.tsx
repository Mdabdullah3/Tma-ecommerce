"use client";
import React, { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Globe, Lock } from 'lucide-react';

interface ToggleSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange }) => {
    return (
        <div
            onClick={() => onChange(!checked)}
            className={`
                w-full flex items-center justify-between bg-[#0a0a0a] rounded-xl border p-1 pr-4 cursor-pointer transition-all duration-300
                ${checked ? 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/10'}
            `}
        >
            <div className="flex items-center gap-3 p-3">
                <div className={`p-2 rounded-lg transition-colors ${checked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-900 text-zinc-600'}`}>
                    {checked ? <Globe size={18} /> : <Lock size={18} />}
                </div>
                <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${checked ? 'text-white' : 'text-zinc-500'}`}>
                        {label}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-600">
                        {checked ? 'ASSET PUBLICLY VISIBLE' : 'INTERNAL DRAFT ONLY'}
                    </span>
                </div>
            </div>

            {/* The Physical Switch */}
            <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${checked ? 'bg-emerald-500/20' : 'bg-zinc-800'}`}>
                <motion.div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full shadow-lg ${checked ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-zinc-500'}`}
                    animate={{ x: checked ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </div>
        </div>
    );
};

export default ToggleSwitch;