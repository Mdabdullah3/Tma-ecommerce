// components/TextInput.tsx - REVISED FOR LABEL/PLACEHOLDER CONFLICT
"use client";
import React, { InputHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    errorMessage?: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, errorMessage, placeholder, ...props }) => { // Added placeholder to props
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!errorMessage;
    const hasValue = !!props.value && String(props.value).length > 0; // Check if value exists and is not empty

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative group"
        >
            {/* The label moves up when focused OR when there's a value */}
            <label className={`absolute left-3 transition-all duration-200 z-10 pointer-events-none px-1
                               ${isFocused || hasValue ? '-top-2 text-xs font-bold bg-[#1a1a2e] text-primary' : 'top-1/2 -translate-y-1/2 text-sm text-zinc-500'}
                               ${hasError ? 'text-rose-500!' : ''}`} 
            >
                {label}
            </label>
            <div className={`relative flex items-center bg-[#1a1a2e]/70 rounded-xl border-2 transition-all duration-200
                            ${isFocused ? 'border-primary shadow-lg shadow-fuchsia-900/30' : // Use specific color for border
                    hasError ? 'border-rose-600 shadow-lg shadow-rose-900/30' :
                        'border-white/10 group-hover:border-white/20'}`}
            >
                <div className={`absolute left-3 transition-colors duration-200
                                ${isFocused ? 'text-primary' : hasError ? 'text-rose-500' : 'text-zinc-600'}`}>
                </div>
                <input
                    {...props}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    // Conditional placeholder: Only show when focused and no value
                    placeholder={isFocused && !hasValue ? placeholder : ''}
                    className={`w-full bg-transparent px-10 py-3 text-white text-sm outline-none font-mono tracking-wide rounded-xl
                                focus:placeholder-zinc-700 transition-colors duration-200`}
                />
            </div>
            <AnimatePresence>
                {hasError && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -bottom-5 left-2 text-rose-500 text-[10px] font-bold flex items-center gap-1"
                    >
                        <AlertCircle size={12} /> {errorMessage}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TextInput;