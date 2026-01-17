"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap, Diamond, ShoppingBag } from 'lucide-react';
import CategorySlider from '@/components/CategorySlider';
import SovereignHeader from '@/components/Header';
import FloatingCartButton from '@/components/FloatingCartButton';
import Background from '@/components/Background';
import Link from 'next/link';
import { useProductStore } from './store/useProductStore';
import Loading from '@/components/Loading';
import { useCartStore } from './store/useCartStore';

export default function MobileBoutique2026() {
  const { products, fetchProducts, loading } = useProductStore();
  const { addToCart, cartItems } = useCartStore();

  // --- FIX 1: PREVENT INFINITE LOOP ---
  // We use an empty dependency array [] so this ONLY runs once when the app opens.
  useEffect(() => {
    fetchProducts();
  }, []);



  if (loading) {
    return <Loading />;
  }


  return (
    <div className="min-h-screen text-white font-sans selection:bg-indigo-500/30 pb-32 relative overflow-hidden">

      {/* Background with performance optimization */}
      <Background />

      <SovereignHeader />

      <main className="relative z-10 pt-20 px-4">
        <MarketTicker />
        <CategorySlider />
        <div className="grid grid-cols-2 gap-x-4 mt-4 gap-y-8">
          {products.map((item, index) => {
            const isInCart = cartItems.some(cartItem => cartItem._id === item._id);

            // Dynamic Rarity Colors (You can hook this to real data later)
            const isLegendary = index % 3 === 0; // Fake logic for demo
            const glowColor = isLegendary ? '#d946ef' : '#06b6d4'; // Fuchsia vs Cyan
            const rarityText = isLegendary ? 'LEGENDARY_CLASS' : 'STANDARD_ISSUE';

            return (
              <Link href={`/products/${item?._id}`} key={item?._id || index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: index * 0.08, duration: 0.6, ease: "backOut" }}
                  className="group relative flex flex-col h-full"
                >

                  {/* --- 0. AMBIENT GLOW BEHIND CARD (The Aura) --- */}
                  <div
                    className="absolute -inset-0.5 rounded-[34px] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                    style={{ backgroundColor: glowColor }}
                  />

                  {/* --- 1. THE MAIN FRAME (Glass & Metal) --- */}
                  <div className="relative w-full aspect-[3/4.2] rounded-[32px] overflow-hidden bg-[#050505] p-[1px] transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">

                    {/* Animated Border Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/5 opacity-50" />

                    {/* INNER CONTENT CONTAINER */}
                    <div className="relative w-full h-full rounded-[31px] overflow-hidden bg-zinc-900">

                      {/* --- 2. HEADER HUD --- */}
                      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-20 p-3 flex justify-between items-start">

                        {/* Rarity Tag */}
                        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-2 py-1 flex flex-col items-start gap-0.5">
                          <span className="text-[6px] font-mono text-zinc-400 uppercase tracking-widest">TIER_{index + 1}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{ color: glowColor, backgroundColor: glowColor }} />
                            <span className="text-[8px] font-bold text-white tracking-widest">{rarityText}</span>
                          </div>
                        </div>

                        {/* Like Icon */}
                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:bg-white/20 transition-all">
                          <Diamond size={12} />
                        </div>
                      </div>

                      {/* --- 3. THE IMAGE & EFFECTS --- */}
                      <div className="relative w-full h-full">
                        <img
                          src={item?.image}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                          alt={item.name}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] opacity-20 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
                      </div>

                      {/* --- 4. THE DATA TERMINAL (Bottom Info) --- */}
                      <div className="absolute bottom-0 inset-x-0 p-3 z-30">

                        {/* Glass Panel */}
                        <div className="relative bg-white/5 backdrop-blur-2xl border-t border-white/10 rounded-[24px] p-3 overflow-hidden group-hover:bg-white/10 transition-colors duration-500">

                          {/* Decorative Top Line */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px]" style={{ backgroundColor: glowColor }} />

                          <div className="flex justify-between items-end gap-2">

                            {/* Left: Info */}
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                              <h3 className="text-[10px] font-mono text-zinc-400 truncate uppercase tracking-wider">
                                {item.name}
                              </h3>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-white tracking-tighter shadow-black drop-shadow-lg leading-none">
                                  {item.priceTon}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-wide opacity-80" style={{ color: glowColor }}>
                                  TON
                                </span>
                              </div>
                            </div>

                            {/* Right: The TRIGGER Button */}
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isInCart) addToCart(item);
                              }}
                              className={`
                                relative w-12 h-12 rounded-[16px] flex items-center justify-center overflow-hidden transition-all duration-300
                                ${isInCart ? ' bg-[#06daff]' : 'bg-white group-hover:scale-105'}
                            `}
                            >
                              {/* Inner Gradient for "Metallic" look */}
                              {!isInCart && <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-100 to-zinc-400 opacity-50" />}

                              {isInCart ? (
                                <ShoppingBag
                                  size={22}
                                  strokeWidth={2.5}
                                  className="text-white fill-white/30"
                                />
                              ) : (
                                <Plus size={24} className="text-black relative z-10" strokeWidth={2.5} />
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </main>

      <FloatingCartButton itemCount={cartItems.length || 0} />
    </div>
  );
}

const MarketTicker = () => {
  return (
    <div className="relative z-20 px-2 w-full overflow-hidden pt-2 backdrop-blur-md ">
      <motion.div
        className="flex items-center gap-x-8 whitespace-nowrap py-2"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              MARKET_STATUS: <span className="text-emerald-400">ONLINE</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              TON: <span className="text-white font-bold">$5.24</span> <span className="text-emerald-500">(+2.4%)</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              VOL: <span className="text-white font-bold">24.5M</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              LATEST_MINT: <span className="text-fuchsia-400">CYBER_APE #4902</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              GAS: <span className="text-yellow-400">LOW</span>
            </span>
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
