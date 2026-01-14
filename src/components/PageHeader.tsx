"use client";

import React, { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    color?: string;
    rightElement?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title, subtitle, color, rightElement
}) => {
    return (
        <nav className="fixed top-0 inset-x-0 z-110 px-6 pt-2 pb-4">
            <div className="relative z-20 flex items-center justify-between pt-4 pb-3 w-full">

                <button
                    onClick={() => window.history.back()}
                    className="p-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-md group active:scale-95"
                >
                    <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span
                        className="text-[10px] font-black tracking-[0.2em] animate-pulse uppercase"
                        style={{ color: color, textShadow: `0 0 10px ${color}40` }}
                    >
                        {subtitle}
                    </span>
                    <h1 className="text-lg font-bold tracking-tight text-white drop-shadow-md whitespace-nowrap ">
                        {title}
                    </h1>
                </div>

                {/* 3. RIGHT: Dynamic Slot (Optional) */}
                <div className="min-w-[40px] flex justify-end">
                    {rightElement ? (
                        rightElement
                    ) : (
                        <div className="w-1" />
                    )}
                </div>

            </div>

        </nav>
    );
};

export default PageHeader;