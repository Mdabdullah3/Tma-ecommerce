import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const StickyButton = ({ itemCount, onClick, title, subtitle }: { itemCount: number, onClick: () => void, title: string, subtitle: string }) => {
    return (
        <div className="fixed bottom-0 inset-x-0 z-110 px-6 pb-4 pt-6 bg-linear-to-t from-black via-black/90 to-transparent">
            <div className="bg-primary text-white rounded-[40px] p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(255,255,255,0.15)]">

                <div className="pl-6 flex flex-col">
                    <span className="text-[7px] font-black uppercase tracking-widest text-zinc-100 italic">{title}</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black italic tracking-tighter">{itemCount}</span>
                        <span className="text-[10px] font-bold text-zinc-900">TON</span>
                    </div>
                </div>

                <motion.button
                    onClick={onClick}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 h-12 rounded-full font-black text-xs tracking-widest uppercase italic cursor-pointer flex items-center gap-3 transition-all duration-700 
                     bg-black text-white`}
                >
                    {subtitle}

                    <ArrowRight size={16} />
                </motion.button>
            </div>
        </div>
    );
};

export default StickyButton;