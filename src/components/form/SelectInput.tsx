/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import React, { SelectHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle } from 'lucide-react';

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
    errorMessage?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, options, errorMessage, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasError = !!errorMessage;
    const selectedLabel = options.find(opt => opt.value === props.value)?.label || '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative group"
            onMouseLeave={() => setIsOpen(false)} // Close on mouse leave
        >
            <label className={`absolute left-3 transition-all duration-200 z-10 pointer-events-none
                               ${props.value ? '-top-2 text-xs font-bold px-1 bg-[#1a1a2e] text-primary' : 'top-1/2 -translate-y-1/2 text-sm text-zinc-500'}
                               ${hasError ? 'text-rose-500!' : ''}`}
            >
                {label}
            </label>
            <motion.button
                type="button" // Important to prevent form submission
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center w-full bg-[#1a1a2e]/70 rounded-xl border-2 pr-4 pl-10 py-3 text-sm transition-all duration-200
                            ${isOpen ? 'border-primary shadow-lg shadow-fuchsia-900/30' :
                        hasError ? 'border-rose-600 shadow-lg shadow-rose-900/30' :
                            'border-white/10 group-hover:border-white/20'}`}
            >
                <div className={`absolute left-3 transition-colors duration-200
                                ${isOpen ? 'text-primary' : hasError ? 'text-rose-500' : 'text-zinc-600'}`}>
                </div>
                <span className="text-white font-mono tracking-wide grow text-left">{selectedLabel || ""}</span>
                <ChevronDown size={18} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#1a1a2e] border border-primary/40 rounded-xl shadow-2xl z-20 overflow-hidden backdrop-blur-md"
                    >
                        {options.map(option => (
                            <motion.button
                                key={option.value}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    props.onChange && props.onChange({ target: { value: option.value, name: props.name } } as React.ChangeEvent<HTMLSelectElement>);
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm font-bold uppercase text-zinc-400 hover:bg-white/5 hover:text-white transition-colors duration-200"
                            >
                                {option.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
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

export default SelectInput;