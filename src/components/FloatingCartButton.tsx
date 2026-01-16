// app/components/FloatingCartButton.tsx
'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface FloatingCartButtonProps {
    itemCount: number;
}


const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount }) => {
    return (
        <>
            <Link href="/carts">
                <motion.button
                    className="fixed bottom-10 right-4 z-50 p-4 bg-amber-600 hover:bg-amber-500 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 ease-in-out"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.8 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <ShoppingCart size={24} />
                    {itemCount > 0 && (
                        <motion.span
                            key={itemCount} // Key for re-animating on count change
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-white text-black text-[10px] font-bold rounded-full"
                        >
                            {itemCount}
                        </motion.span>
                    )}
                </motion.button>
            </Link>
        </>
    );
};

export default FloatingCartButton;