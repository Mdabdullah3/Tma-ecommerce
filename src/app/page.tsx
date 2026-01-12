"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import CategorySlider from '@/components/CategorySlider';
const CyberHeader = dynamic(() => import('@/components/Header'), { ssr: false });
const FloatingCartButton = dynamic(() => import('@/components/FloatingCartButton'), { ssr: false });

const PRODUCTS = [
  { id: 1, name: "ROSE_GENESIS", price: "2.40", cat: "ART", img: "https://nftmak.netlify.app/assets/img/others/top_collection01.jpg" },
  { id: 2, name: "AMETHYST_V1", price: "1.15", cat: "WEAR", img: "https://nftmak.netlify.app/assets/img/others/top_collection02.jpg" },
  { id: 3, name: "CHROME_CORE", price: "4.80", cat: "HARD", img: "https://shreethemes.in/superex/layouts/images/items/3.jpg" },
  { id: 4, name: "NOIR_ELEMENT", price: "0.95", cat: "ACC", img: "https://shreethemes.in/superex/layouts/images/items/1.jpg" },
];

export default function MobileBoutique2026() {
  const [cartCount, setCartCount] = useState(0);


  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-rose-500 pb-24">
      <CyberHeader />

      <main className="pt-24 px-4 space-y-6">
        {/* --- PREMIUM HERO: THE ANNOUNCEMENT --- */}
        <CategorySlider />
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
              <div className="relative aspect-4/5 rounded-[40px] overflow-hidden border border-white/10  shadow-2xl transition-all duration-500 group-hover:border-rose-500/30">

                {/* Product Asset (Image) */}
                <motion.img
                  src={item.img}
                  className="w-full h-full object-cover  group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
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

      <FloatingCartButton itemCount={cartCount} onClick={() => { }} />

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