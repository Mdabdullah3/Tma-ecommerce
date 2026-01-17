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
        <header className="fixed top-0 inset-x-0 z-50 p-4">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3 flex justify-between items-center shadow-2xl">
                <button onClick={() => router.back()} className="text-[10px] font-mono text-zinc-400 hover:text-white uppercase tracking-widest">
                    ← RETURN
                </button>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    {title.toUpperCase()}
                </span>
                <div className="w-8" />
            </div>
        </header>
    );
};

export default PageHeader;