"use client";
import React, { InputHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Terminal } from 'lucide-react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    errorMessage?: string;
    icon?: React.ElementType;
}

const TextInput: React.FC<TextInputProps> = ({ label, errorMessage, icon: Icon, placeholder, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!errorMessage;
    const hasValue = !!props.value && String(props.value).length > 0;

    return (
        <div className="w-full relative group">
            {/* Label Line */}
            <div className="flex justify-between items-end mb-2 px-1">
                <label className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${isFocused ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {label}
                </label>
                {/* Status Light */}
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${hasError ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : (hasValue ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-800')}`} />
            </div>

            {/* Input Container */}
            <div className={`
                relative flex items-center bg-[#0a0a0a] rounded-xl overflow-hidden transition-all duration-300
                ${isFocused
                    ? 'shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-emerald-500/50'
                    : hasError
                        ? 'ring-1 ring-red-500/50'
                        : 'ring-1 ring-white/10 hover:ring-white/20'}
            `}>
                {/* Icon Box */}
                <div className="pl-4 pr-2 text-zinc-500">
                    {Icon ? <Icon size={16} className={isFocused ? 'text-emerald-400' : ''} /> : <Terminal size={16} />}
                </div>

                <input
                    {...props}
                    onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
                    onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
                    placeholder={placeholder}
                    className="w-full bg-transparent py-4 pr-4 text-xs font-mono text-white placeholder:text-zinc-700 outline-none uppercase tracking-wide"
                />

                {/* Animated Bottom Line */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 transition-all duration-300"
                    style={{ width: isFocused ? '100%' : '0%', opacity: isFocused ? 1 : 0 }}
                />
            </div>

            <AnimatePresence>
                {hasError && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -bottom-5 right-0 text-red-500 text-[9px] font-mono uppercase tracking-wider flex items-center gap-1"
                    >
                        <AlertCircle size={10} /> {errorMessage}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TextInput;