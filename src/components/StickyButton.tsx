import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const StickyButton = ({ itemCount, onClick, title, subtitle }: { itemCount: number | string, onClick: () => void, title: string, subtitle: string }) => {
    return (
        <div className="fixed bottom-0 inset-x-0 z-120 px-6 pb-8 pt-10 bg-linear-to-t from-black via-black/80 to-transparent pointer-events-none">
            <div className="bg-primary text-white rounded-[40px] p-2 flex items-center justify-between shadow-2xl pointer-events-auto">

                <div className="pl-6 flex flex-col">
                    <span className="text-[7px] font-black uppercase tracking-widest text-white/60 italic">{title}</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black italic tracking-tighter">{itemCount}</span>
                        <span className="text-[10px] font-bold text-black/40">TON</span>
                    </div>
                </div>

                <motion.button
                    // Ensure onClick is definitely triggered
                    onClick={(e) => {
                        e.preventDefault();
                        onClick();
                    }}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    className="px-6 h-12 rounded-full font-black text-xs tracking-widest uppercase italic cursor-pointer flex items-center gap-3 bg-black text-white shadow-xl"
                >
                    {subtitle}
                    <ArrowRight size={16} />
                </motion.button>
            </div>
        </div>
    );
};

export default StickyButton;