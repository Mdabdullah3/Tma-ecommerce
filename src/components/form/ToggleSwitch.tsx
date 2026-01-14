// components/ToggleSwitch.tsx
"use client";
import React, { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface ToggleSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full flex items-center justify-between bg-[#1a1a2e]/70 rounded-xl border-2 border-white/10 p-3 pr-4 transition-all duration-200
                        ${checked ? 'bg-[#1a1a2e]/90 border-primary/30' : ''}
                        ${className || ''}`}
        >
            <span className="text-sm font-bold uppercase text-white tracking-wide">{label}</span>
            <motion.button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex items-center p-1
                            ${checked ? 'bg-primary' : 'bg-zinc-700'}`}
                whileTap={{ scale: 0.95 }}
                {...props}
            >
                <motion.div
                    className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    initial={false}
                    animate={{ x: checked ? 'calc(100% - 2px)' : '0px' }} // Adjusted for padding
                >
                    {checked ? (
                        <Check size={16} className="text-fuchsia-600" />
                    ) : (
                        <X size={16} className="text-zinc-700" />
                    )}
                </motion.div>
            </motion.button>
        </motion.div>
    );
};

export default ToggleSwitch;