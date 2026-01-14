// components/PrimaryButton.tsx
"use client";
import React from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
type MotionButtonProps = React.ComponentPropsWithoutRef<'button'> & MotionProps;
interface PrimaryButtonProps extends MotionButtonProps {
    label: string;
    icon?: React.ElementType;
    isLoading?: boolean;
    disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, icon: Icon, isLoading, disabled, className, ...props }) => {
    return (
        <>
            <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={isLoading || disabled}
                className={`w-full h-14 rounded-xl flex items-center justify-center gap-3 text-white font-extrabold italic uppercase text-sm
                        bg-linear-to-br from-primary to-primary/60 shadow-lg shadow-fuchsia-900/40
                        hover:from-primary hover:to-primary/70 active:from-fuchsia-700 active:to-purple-700
                        transition-all duration-200 relative overflow-hidden group
                        ${isLoading || disabled ? 'opacity-60 cursor-not-allowed' : ''}
                        ${className || ''}`}
                {...props}
            >
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2"
                        >
                            <Loader2 size={20} className="animate-spin" />
                            <span className="text-sm">PROCESSING...</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2"
                        >
                            {Icon && <Icon size={20} className="relative z-10" />}
                            <span className="relative z-10">{label}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Subtle glow effect on hover */}
                <span className="absolute inset-0 rounded-xl ring-2 ring-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse-light-alt" />
            </motion.button>
        </>
    );
};

export default PrimaryButton;