"use client";

import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShoppingBag, Zap, Sparkles } from 'lucide-react';
import CyberHeader from '@/components/Header';
import FloatingCartButton from '@/components/FloatingCartButton';

const PRODUCTS = [
  { id: 1, name: "ROSE_GENESIS", price: "2.40", cat: "ART", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe" },
  { id: 2, name: "AMETHYST_V1", price: "1.15", cat: "WEAR", img: "https://images.unsplash.com/photo-1635339001024-6da089bc6074" },
  { id: 3, name: "CHROME_CORE", price: "4.80", cat: "HARD", img: "https://images.unsplash.com/photo-1614728263952-84ea206f9c41" },
  { id: 4, name: "NOIR_ELEMENT", price: "0.95", cat: "ACC", img: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4" },
];

export default function MobileBoutique2026() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      WebApp.ready();
      WebApp.expand();
      WebApp.setHeaderColor('#0A0A0A');
      WebApp.setBackgroundColor('#0A0A0A');
    }
  }, []);

  const addToCart = () => {
    WebApp.HapticFeedback.notificationOccurred('success');
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-rose-500 pb-24">
      <CyberHeader />

      <main className="pt-24 px-4 space-y-8">
        {/* --- PREMIUM HERO: THE ANNOUNCEMENT --- */}
        <section className="relative h-52 rounded-[32px] overflow-hidden border border-white/10 group bg-black">
          {/* --- LAYER 1: THE TEXTURE & IMAGE --- */}
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
              className="w-full h-full object-cover brightness-[0.6] grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[3000ms] ease-out"
              alt="Hero"
            />
            {/* Subtle Noise Overlay for Film Grain effect */}
            <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </motion.div>

          {/* --- LAYER 2: THE AMBIENT ROSE GLOW --- */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              x: [-10, 10, -10]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-rose-600/20 blur-[80px] rounded-full"
          />

          {/* --- LAYER 3: KINETIC TYPOGRAPHY --- */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end overflow-hidden">

            {/* Top Label with Line */}
            <div className="flex items-center gap-3 mb-2 translate-y-2 opacity-60">
              <span className="text-[9px] font-black tracking-[0.5em] text-rose-400 uppercase">
                Season_2026
              </span>
            </div>

            {/* Main Headline: Large & Bold */}
            <div className="relative">
              <h2 className="text-5xl font-black italic tracking-tighter leading-none uppercase mix-blend-difference">
                Aura
                <motion.span
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="block text-rose-500 not-italic ml-6"
                >
                  Noir
                </motion.span>
              </h2>

              {/* Decorative vertical text for luxury feel */}
              <div className="absolute -right-4 bottom-0 rotate-90 origin-bottom-right">
                <span className="text-[7px] font-bold text-white/20 tracking-[1em] uppercase whitespace-nowrap">
                  LIMITED_EDITION_COLLECTION
                </span>
              </div>
            </div>
          </div>

          {/* --- LAYER 4: OPTICAL FLARE (The "Wow" Touch) --- */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-[20%] left-[-10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent rotate-[-15deg] blur-sm" />
          </div>
        </section>

        {/* --- DYNAMIC PRODUCT GRID --- */}
        <div className="grid grid-cols-2 gap-4">
          {PRODUCTS.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileTap={{ scale: 0.98 }}
              className="relative flex flex-col group"
            >
              {/* --- CARD ARCHITECTURE --- */}
              <div className="relative aspect-4/5 rounded-[40px] overflow-hidden border border-white/10 bg-linear-to-b from-white/[0.07] to-transparent shadow-2xl transition-all duration-500 group-hover:border-rose-500/30">

                {/* Product Asset (Image) */}
                <motion.img
                  src={item.img}
                  className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                  alt={item.name}
                />




                {/* --- THE PRICE MONOLITH (BOTTOM HUD) --- */}
                <div className="absolute bottom-0 inset-x-0 p-3">
                  <div className="bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[28px] p-2 flex items-center justify-between">

                    {/* Price Section */}
                    <div className="pl-3 flex flex-col">
                      <span className="text-[6px] font-black text-zinc-500 tracking-widest uppercase mb-0.5">Reserve</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-white italic tracking-tighter">{item.price}</span>
                        <span className="text-[8px] font-bold text-rose-500">TON</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={addToCart}
                      className="relative w-11 h-11 bg-white rounded-[20px] flex items-center justify-center text-black overflow-hidden group/btn"
                    >
                      {/* Internal Glow on Button */}
                      <div className="absolute inset-0 bg-rose-500 translate-y-12 group-hover/btn:translate-y-0 transition-transform duration-500" />
                      <Zap size={16} className="relative z-10 group-hover/btn:text-white transition-colors duration-500" fill="currentColor" />
                    </motion.button>
                  </div>
                </div>

                {/* Subtle Rose Light Leak (Appears on Hover) */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-rose-600/0 group-hover:bg-rose-600/20 blur-[60px] transition-all duration-700" />
              </div>

              {/* --- TYPOGRAPHY FOOTER --- */}
              <div className="mt-4 px-3 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black italic tracking-tighter text-white uppercase group-hover:text-rose-500 transition-colors">
                    {item.name}
                  </h3>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-bold text-zinc-600 tracking-widest uppercase">Verified Artifact</span>
                  <ArrowUpRight size={10} className="text-zinc-700 group-hover:text-white transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <FloatingCartButton itemCount={cartCount} onClick={() => WebApp.openCart()} />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Satoshi:wght@700;900&display=swap');
        body { 
          background-color: #050505; 
          font-family: 'Satoshi', sans-serif;
          overscroll-behavior-y: none;
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}