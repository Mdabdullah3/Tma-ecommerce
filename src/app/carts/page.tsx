"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2, Ticket,
    Hash, Cpu
} from 'lucide-react';
import Background from '@/components/Background';
import PageHeader from '@/components/PageHeader';
import StickyButton from '@/components/StickyButton';
import { useCartStore } from '../store/useCartStore';


const VALID_COUPONS: Record<string, number> = { "SOVEREIGN": 0.20, "GIFT50": 0.50 };

export default function UnifiedVault() {
    const { cartItems, removeFromCart } = useCartStore();
    const [couponInput, setCouponInput] = useState("");
    const [discount, setDiscount] = useState(0);
    const [couponStatus, setCouponStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const subtotal = cartItems.reduce((acc, item) => acc + item.priceTon, 0);
    const protocolFee = 0.05;
    const discountAmount = subtotal * discount;
    const total = subtotal + protocolFee - discountAmount;





    const handleApplyCoupon = () => {
        const code = couponInput.toUpperCase().trim();
        if (VALID_COUPONS[code]) {
            setDiscount(VALID_COUPONS[code]);
            setCouponStatus('success');
        } else {
            setDiscount(0);
            setCouponStatus('error');
            setTimeout(() => setCouponStatus('idle'), 2000);
        }
    };

    const handleCheckout = () => {
        // Checkout logic to be implemented
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-amber-500 overflow-x-hidden relative">
            <Background />
            <PageHeader title="CHECKOUT_CART" />

            <main className="relative z-10 pt-20 pb-28 px-6 space-y-4">
                {/* --- SECTION 1: INVENTORY CHAMBERS --- */}
                <section className="space-y-3 mt-2">
                    <AnimatePresence mode='popLayout'>
                        {cartItems.length > 0 ? cartItems.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative group bg-[#050505]/40 rounded-[40px] p-4 flex items-center gap-5 border border-white/5 shadow-2xl"
                            >
                                <div className="relative w-20 h-20 rounded-[24px] overflow-hidden border border-white/10 flex-shrink-0">
                                    <img src={item.image} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-700" alt="T" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[7px] font-mono font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">ID_0{item?.productId || '0g0'}</span>
                                        <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">{item.category}</span>
                                    </div>
                                    <h3 className="text-sm font-black italic tracking-tighter text-white uppercase truncate">{item.name}</h3>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-xs font-black text-white">{item.priceTon}</span>
                                        <span className="text-[8px] font-bold text-amber-500">TON</span>
                                    </div>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() => removeFromCart(item._id)}
                                    className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                                >
                                    <Trash2 size={16} />
                                </motion.button>
                            </motion.div>
                        )) : (
                            <div className="py-20 flex flex-col items-center gap-4 opacity-20 grayscale">
                                <Hash size={48} strokeWidth={1} />
                                <span className="text-[10px] font-black tracking-widest uppercase">NO_ITEMS</span>
                            </div>
                        )}
                    </AnimatePresence>
                </section>

                {/* --- SECTION 2: CONFIGURATION (COUPON) --- */}
                {cartItems?.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-4 px-2">
                            <span className="text-[9px] font-black tracking-[0.4em] text-zinc-600 uppercase italic leading-none">Voucher</span>
                            <div className="h-[0.5px] flex-1 bg-white/5" />
                        </div>
                        <div className="relative bg-[#0c0c0c]/60 rounded-[30px] p-2 flex items-center border border-white/5 shadow-inner">
                            <div className="pl-4 pr-3 text-amber-500">
                                <Ticket size={18} />
                            </div>
                            <input
                                type="text"
                                value={couponInput}
                                onChange={(e) => { setCouponInput(e.target.value); setCouponStatus('idle'); }}
                                placeholder="ENTER_CODE"
                                className="bg-transparent flex-1 text-[10px] font-black tracking-[0.2em] outline-none placeholder:text-zinc-800 uppercase italic"
                            />
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleApplyCoupon}
                                className={`h-11 px-6 rounded-[22px] font-black text-[9px] tracking-widest transition-all duration-500
                                    ${couponStatus === 'success' ? 'bg-green-500 text-black' :
                                        couponStatus === 'error' ? 'bg-rose-500 text-white' : 'bg-white text-black'}`}
                            >
                                {couponStatus === 'success' ? 'VALIDATED' : couponStatus === 'error' ? 'RETRY' : 'APPLY'}
                            </motion.button>
                        </div>
                    </section>
                )}

                {/* --- SECTION 3: FINANCIAL AUDIT --- */}
                {cartItems.length > 0 && (
                    <section className="space-y-2">

                        <div className="bg-[#050505]/60 rounded-[45px] p-8 border border-white/5 shadow-2xl space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-zinc-500">
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Net_Assets</span>
                                    <span className="text-sm font-black italic text-white">{subtotal.toFixed(2)} TON</span>
                                </div>
                                <div className="flex justify-between items-center text-zinc-500">
                                    <div className="flex items-center gap-2">
                                        <Cpu size={12} className="text-amber-500/50" />
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">Platform Fee</span>
                                    </div>
                                    <span className="text-sm font-black italic text-amber-500">+{protocolFee} TON</span>
                                </div>
                                <AnimatePresence>
                                    {discount > 0 && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex justify-between items-center text-green-500 border-t border-white/5 pt-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">Privé_Discount</span>
                                            <span className="text-sm font-black italic">-{discountAmount.toFixed(2)} TON</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-black text-white uppercase italic tracking-tighter">Total_Cost</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">Finalized_Rate</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-4xl font-black italic tracking-tighter text-white leading-none">
                                        {total.toFixed(2)} <span className="text-sm text-amber-500 italic ml-1">TON</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* --- SECTION 4: THE EXECUTION HUB (STICKY) --- */}
            {cartItems.length > 0 && (
                <StickyButton itemCount={total || 0} onClick={handleCheckout} title="CHECKOUT" subtitle="PROCEED" />
            )}
        </div>
    );
}