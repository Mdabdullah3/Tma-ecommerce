/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import React, { SelectHTMLAttributes, useState, useRef, useEffect } from 'react';
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
    const selectRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative group font-sans" // Use a premium sans-serif font
            ref={selectRef}
        >
            {/* Floating Label */}
            <label className={`absolute left-4 transition-all duration-200 z-10 pointer-events-none
                           ${props.value || isOpen ? '-top-2 text-xs font-semibold px-2 bg-gradient-to-r from-[#1a1a2e] to-transparent text-primary-light tracking-wide' : 'top-1/2 -translate-y-1/2 text-base text-zinc-500'}
                           ${hasError ? '!text-rose-500' : ''}`}
            >
                {label}
            </label>

            {/* Select Button */}
            <motion.button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center w-full bg-gradient-to-br from-[#1a1a2e] to-[#141420] rounded-xl border px-5 py-3 text-lg transition-all duration-300 ease-in-out transform
                    ${isOpen ? 'border-primary-accent shadow-glow scale-[1.01]' :
                        hasError ? 'border-rose-600 shadow-error' :
                            'border-zinc-700 hover:border-zinc-500 hover:shadow-md hover:shadow-primary-accent/10'}`}
            >
                <span className="text-white font-medium tracking-wide grow text-left pl-0 pt-0.5">{selectedLabel}</span> {/* Placeholder */}
                <ChevronDown size={20} className={`text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-accent' : ''}`} />
            </motion.button>

            {/* Dropdown Options */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 w-full mt-2 bg-gradient-to-br from-[#1a1a2e] to-[#141420] border border-primary-accent/50 rounded-xl shadow-2xl z-20 overflow-hidden
                       backdrop-blur-sm backdrop-filter-gradient" // Added custom class for subtle gradient
                    >
                        {options.map(option => (
                            <motion.button
                                key={option.value}
                                type="button"
                                whileTap={{ scale: 0.99, backgroundColor: 'rgba(255,255,255,0.05)' }} // Subtle tap effect
                                onClick={() => {
                                    props.onChange && props.onChange({ target: { value: option.value, name: props.name } } as React.ChangeEvent<HTMLSelectElement>);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-5 py-3 text-base font-medium tracking-wide
                            ${option.value === props.value ? 'bg-primary-accent/20 text-primary-light' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}
                            transition-colors duration-200`}
                            >
                                {option.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
                {hasError && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -bottom-6 left-4 text-rose-500 text-xs font-semibold flex items-center gap-1"
                    >
                        <AlertCircle size={14} className="text-rose-500" /> {errorMessage}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SelectInput;