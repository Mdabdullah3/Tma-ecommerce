"use client";

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    color?: string;
    rightElement?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title
}) => {
    const router = useRouter();
    return (
        <header className="fixed -top-1 inset-x-0 z-50 p-4">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3 flex justify-between items-center shadow-2xl">
                <button onClick={() => router.back()} className="text-[10px] font-mono text-zinc-400 hover:text-white uppercase tracking-widest">
                    ← BACK
                </button>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    {title.toUpperCase()}
                </span>
                <div className="w-8 h-8 rounded-full bg-zinc-900/80 border border-white/10 flex items-center justify-center backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#f59e0b]" />
                </div>
            </div>
        </header>
    );
};

export default PageHeader;


