"use client";
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Sparkles, Layers
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/app/store/useCartStore';
import { useProductStore } from '@/app/store/useProductStore';
import Background from '@/components/Background';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/Loading';

export default function ProductDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { currentProduct, fetchProductById, loading } = useProductStore();
    const { addToCart, cartItems } = useCartStore();

    const isInCart = currentProduct ? cartItems.some(i => i._id === currentProduct._id) : false;

    useEffect(() => {
        if (typeof window !== 'undefined' && WebApp) {
            WebApp.BackButton.show();
            WebApp.BackButton.onClick(() => router.back());
            WebApp.MainButton.hide();
        }
    }, [router]);

    useEffect(() => {
        if (id) fetchProductById(id as string);
    }, [id, fetchProductById]);

    if (loading || !currentProduct) {
        return (
            <Loading />
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
            <Background />
            <PageHeader title="Asset Details" />

            <main className="relative z-10 pt-24 px-4 pb-40">

                {/* --- 3. THE ARTIFACT (Main Image) --- */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative w-full aspect-square max-w-md mx-auto mb-10"
                >
                    {/* Glass Frame */}
                    <div className="relative w-full h-full rounded-[40px] overflow-hidden border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-sm p-2">
                        <div className="w-full h-full rounded-[32px] overflow-hidden relative">
                            <img
                                src={currentProduct.image}
                                className="w-full h-full object-cover"
                                alt={currentProduct.name}
                            />
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
                        </div>
                    </div>
                </motion.div>

                {/* --- 4. INFORMATION (Glass Sheet) --- */}
                <div className="max-w-md mx-auto space-y-6">

                    {/* Title & Price Section */}
                    <div className="flex flex-col items-center text-center gap-2">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 uppercase leading-[0.9]"
                        >
                            {currentProduct.name}
                        </motion.h1>

                        {/* Dynamic Status / Rarity implied by Price */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-1.5">
                                <Sparkles size={10} className="text-emerald-400" />
                                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Available</span>
                            </div>
                        </div>
                    </div>

                    {/* Description Glass Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-[30px] bg-white/5 backdrop-blur-xl border border-white/10 space-y-4"
                    >
                        <div className="flex items-center gap-2 opacity-50">
                            <Layers size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Asset_Details</span>
                        </div>

                        <p className="text-sm leading-relaxed text-zinc-300 font-light">
                            {currentProduct.description}
                        </p>

                        {/* Dynamic Tags derived from Product Data */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            <div className="px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 text-[10px] font-mono text-zinc-400">
                                #{currentProduct.category.toUpperCase()}
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 text-[10px] font-mono text-zinc-400">
                                {currentProduct.priceTon > 100 ? 'HIGH_VALUE' : 'STANDARD'}
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 text-[10px] font-mono text-zinc-400">
                                TON_NETWORK
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* --- 5. THE FLOATING ACTION DOCK --- */}
            <div className="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto">
                <div className="h-20 rounded-[30px] bg-white/10 backdrop-blur-3xl border border-white/20 p-2 flex items-center justify-between shadow-[0_20px_40px_rgba(0,0,0,0.4)]">

                    {/* Price Display */}
                    <div className="flex flex-col pl-6 justify-center">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Total Cost</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white tracking-tighter drop-shadow-lg">
                                {currentProduct.priceTon}
                            </span>
                            <span className="text-xs font-bold text-white/60">TON</span>
                        </div>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(currentProduct)}
                        disabled={isInCart}
                        className={`
                            h-full px-8 rounded-[24px] flex items-center gap-3 transition-all duration-300 shadow-lg
                            ${isInCart
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white text-black hover:bg-zinc-200'}
                        `}
                    >
                        {isInCart ? (
                            <div className="flex flex-col items-center leading-none">
                                <span className="font-black text-xs uppercase tracking-widest">Added</span>
                                <span className="text-[8px] font-mono opacity-80">IN_VAULT</span>
                            </div>
                        ) : (
                            <>
                                <span className="font-black text-sm uppercase tracking-widest">Purchase</span>
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                                    <ShoppingBag size={14} />
                                </div>
                            </>
                        )}
                    </motion.button>
                </div>
            </div>

        </div>
    );
}