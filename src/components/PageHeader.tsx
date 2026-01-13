"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
    title?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title = "MANIFEST"
}) => {
    return (
        <nav className="fixed top-0 inset-x-0 z-110 px-6 pt-2 pb-4">
            <div className="relative h-14 bg-black/40 backdrop-blur-2xl rounded-[35px] border-[0.5px] border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] flex items-center overflow-hidden">
                <div className="absolute top-[-50%] left-[-10%] w-40 h-40 bg-amber-500/10 blur-[60px] -z-10" />
                <div className="absolute left-3">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.history.back()}
                        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_10px_20px_rgba(255,255,255,0.1)] group transition-all duration-500 hover:bg-primary/80"
                    >
                        <ArrowLeft size={22} strokeWidth={2.5} />
                    </motion.button>
                </div>

                {/* --- CENTER: EDITORIAL TITLE --- */}
                <div className="w-full flex justify-center">
                    <div className="relative">
                        {/* Kinetic Glow underneath the text */}
                        <motion.div
                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 blur-lg bg-amber-500/30 rounded-full z-0"
                        />

                        <h1 className="relative z-10 text-sm  uppercase text-white leading-none">
                            {title}
                        </h1>
                    </div>
                </div>
                <div className="absolute right-3 w-14 h-14" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
            </div>

        </nav>
    );
};

export default PageHeader;