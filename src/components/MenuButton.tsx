import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
interface MenuButtonProps {
    color: string;
    icon: React.ElementType;
    name: string;
    onClick?: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ color, icon: Icon, name, onClick }) => {
    return (
        <motion.button whileTap={{ scale: 0.98 }} onClick={onClick} className="relative w-full group h-20 rounded-[30px] bg-[#0c0c0c]/20 border border-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div style={{ backgroundColor: color }} className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Icon size={22} strokeWidth={2.5} />
                </div>
                <div className="text-left flex flex-col">
                    <span className="text-sm font-black tracking-tighter uppercase leading-none">{name}</span>

                </div>
            </div>
            <ChevronRight size={18} className="text-zinc-800 group-hover:text-white transition-all" />
        </motion.button>
    );
};

export default MenuButton;