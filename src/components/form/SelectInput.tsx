/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import React, { SelectHTMLAttributes, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Layers } from 'lucide-react';

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
    errorMessage?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, options, errorMessage, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasError = !!errorMessage;
    const selectedLabel = options.find(opt => opt.value === props.value)?.label || 'SELECT CLASS';
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="w-full relative group" ref={selectRef}>
            <div className="flex justify-between items-end mb-2 px-1">
                <label className={`text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500`}>
                    {label}
                </label>
            </div>

            <motion.button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative flex items-center w-full bg-[#0a0a0a] rounded-xl border px-4 py-4 transition-all duration-300
                    ${isOpen ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : hasError ? 'border-red-500' : 'border-white/10 hover:border-white/20'}
                `}
            >
                <Layers size={16} className={`mr-3 ${isOpen ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span className={`text-xs font-mono uppercase grow text-left ${props.value ? 'text-white' : 'text-zinc-600'}`}>
                    {selectedLabel}
                </span>
                <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute top-full left-0 w-full mt-2 bg-[#0c0c0c] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        {options.map((option, i) => (
                            <motion.button
                                key={option.value}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                type="button"
                                onClick={() => {
                                    props.onChange && props.onChange({ target: { value: option.value, name: props.name } } as React.ChangeEvent<HTMLSelectElement>);
                                    setIsOpen(false);
                                }}
                                className={`
                                    w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-between group
                                    ${option.value === props.value ? 'bg-emerald-900/20 text-emerald-400' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}
                                `}
                            >
                                {option.label}
                                {option.value === props.value && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#22d3ee]" />}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SelectInput;