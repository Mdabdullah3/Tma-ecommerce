/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2, Ticket,
    ShieldCheck, Zap, Server, ChevronRight, AlertCircle, Terminal
} from 'lucide-react';
import Background from '@/components/Background';
import PageHeader from '@/components/PageHeader';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { useRouter } from 'next/navigation';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';

const VALID_COUPONS: Record<string, number> = {
    "SOVEREIGN": 0.20,
    "GIFT50": 0.50
};

export default function UnifiedVault() {
    const { cartItems, clearCart, removeFromCart } = useCartStore();
    const { placeOrder, loading: isOrdering } = useOrderStore();
    const router = useRouter();

    const [tonConnectUI] = useTonConnectUI();
    const userWalletAddress = useTonAddress();

    // UI States
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const [discount, setDiscount] = useState(0);
    const [couponStatus, setCouponStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Calculations
    const subtotal = cartItems.reduce((acc, item) => acc + item.priceTon, 0);
    const protocolFee = 0.05;
    const discountAmount = subtotal * discount;
    const total = Math.max(0, subtotal + protocolFee - discountAmount);

    // --- TELEGRAM NATIVE BUTTON LOGIC ---
    useEffect(() => {
        if (typeof window !== 'undefined' && WebApp) {
            if (cartItems.length > 0) {
                // Configure Main Button
                const btnText = isOrdering
                    ? "PROCESSING..."
                    : !userWalletAddress && !isDemoMode
                        ? "CONNECT WALLET"
                        : `PAY ${total.toFixed(2)} TON`;

                WebApp.MainButton.setText(btnText);
                WebApp.MainButton.show();

                // Color Logic
                if (!userWalletAddress && !isDemoMode) {
                    WebApp.MainButton.setParams({ color: '#3b82f6' }); // Blue for Connect
                } else {
                    WebApp.MainButton.setParams({ color: '#10b981' }); // Green for Pay
                }

                // Click Handler
                const handleMainBtnClick = () => {
                    handleCheckout();
                };

                WebApp.MainButton.onClick(handleMainBtnClick);

                // Cleanup
                return () => {
                    WebApp.MainButton.offClick(handleMainBtnClick);
                    WebApp.MainButton.hide();
                };
            } else {
                WebApp.MainButton.hide();
            }
        }
    }, [cartItems, total, userWalletAddress, isDemoMode, isOrdering]);


    const handleApplyCoupon = () => {
        const code = couponInput.toUpperCase().trim();
        if (VALID_COUPONS[code]) {
            setDiscount(VALID_COUPONS[code]);
            setCouponStatus('success');
            WebApp?.HapticFeedback.notificationOccurred('success');
        } else {
            setDiscount(0);
            setCouponStatus('error');
            WebApp?.HapticFeedback.notificationOccurred('error');
            setTimeout(() => setCouponStatus('idle'), 2000);
        }
    };

    const handleCheckout = async () => {
        // 1. Connection Guard
        if (!userWalletAddress && !isDemoMode) {
            tonConnectUI.openModal();
            return;
        }

        try {
            // 2. Balance Check
            if (!isDemoMode) {
                const response = await fetch(`https://toncenter.com/api/v2/getAddressInformation?address=${userWalletAddress}`);
                const data = await response.json();
                if (!data.ok) throw new Error("Chain sync error");
                const balanceTon = parseInt(data.result.balance) / 1000000000;

                if (balanceTon < total) {
                    WebApp?.HapticFeedback.notificationOccurred('error');
                    WebApp?.showAlert(`INSUFFICIENT FUNDS. You have ${balanceTon.toFixed(2)} TON.`);
                    return;
                }
            }

            // 3. Place Order
            const telegramUser = WebApp?.initDataUnsafe?.user;
            const orderData = {
                user: telegramUser?.id?.toString() || "PORTFOLIO_REVIEWER",
                walletAddress: isDemoMode ? "DEMO_MODE_ACTIVE" : userWalletAddress,
                products: cartItems.map(item => ({
                    productId: item._id,
                    name: item.name,
                    priceTon: item.priceTon,
                    image: item.image
                })),
                totalAmount: Number(total.toFixed(2)),
                status: isDemoMode ? "DEMO_COMPLETED" : "PENDING"
            };

            const success = await placeOrder(orderData);

            if (success) {
                WebApp?.HapticFeedback.notificationOccurred('success');
                clearCart();
                router.push('/profile'); // or success page
            }

        } catch (error) {
            console.error(error);
            WebApp?.showAlert("Transaction failed. Check network.");
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500 pb-32">
            <Background />
            <PageHeader title="CART_CHECKOUT" />
            <main className="relative z-10 pt-24 px-4 space-y-6">

                {/* --- 1. MODE SELECTOR (Glass Pill) --- */}
                <div
                    onClick={() => setIsDemoMode(!isDemoMode)}
                    className={`relative overflow-hidden p-[1px] rounded-[20px] transition-all duration-500 cursor-pointer group ${isDemoMode ? 'bg-gradient-to-r from-amber-500/50 to-orange-600/50' : 'bg-white/10'}`}
                >
                    <div className="relative bg-[#0a0a0a] rounded-[19px] p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${isDemoMode ? 'bg-amber-500 text-black border-amber-400' : 'bg-zinc-900 text-zinc-600 border-zinc-800'}`}>
                                {isDemoMode ? <Terminal size={18} /> : <ShieldCheck size={18} />}
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isDemoMode ? 'text-amber-500' : 'text-zinc-500'}`}>
                                    {isDemoMode ? 'SIMULATION_MODE' : 'MAINNET_MODE'}
                                </span>
                                <span className="text-[8px] font-mono text-zinc-600">
                                    {isDemoMode ? 'VIRTUAL FUNDS ENABLED' : 'REAL TRANSACTIONS'}
                                </span>
                            </div>
                        </div>
                        {/* Switch UI */}
                        <div className={`w-8 h-4 rounded-full border border-white/10 relative transition-colors ${isDemoMode ? 'bg-amber-900/40' : 'bg-zinc-800'}`}>
                            <motion.div
                                animate={{ x: isDemoMode ? 16 : 2 }}
                                className={`absolute top-0.5 w-3 h-3 rounded-full ${isDemoMode ? 'bg-amber-500' : 'bg-zinc-500'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* --- 2. INVENTORY SLATES --- */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 pl-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                            PENDING_ASSETS ({cartItems.length})
                        </span>
                    </div>

                    <AnimatePresence mode='popLayout'>
                        {cartItems.length > 0 ? cartItems.map((item, i) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative"
                            >
                                {/* Glowing Border */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative bg-[#0c0c0c] border border-white/5 rounded-[24px] p-3 flex gap-4 items-center">
                                    {/* Image Thumbnail */}
                                    <div className="relative w-16 h-16 rounded-[16px] overflow-hidden border border-white/10 bg-zinc-900">
                                        <img src={item.image} className="w-full h-full object-cover" alt="NFT" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[7px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 rounded uppercase">Verified</span>
                                        </div>
                                        <h4 className="text-xs font-black text-white uppercase tracking-wide truncate">
                                            {item.name}
                                        </h4>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-bold text-zinc-300">{item.priceTon}</span>
                                            <span className="text-[8px] font-bold text-zinc-600">TON</span>
                                        </div>
                                    </div>

                                    {/* Delete Trigger */}
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="py-12 border border-dashed border-zinc-800 rounded-[30px] flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-zinc-900/50 flex items-center justify-center">
                                    <Server size={24} className="text-zinc-700" />
                                </div>
                                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                                    NO_ASSETS_DETECTED
                                </span>
                            </div>
                        )}
                    </AnimatePresence>
                </section>

                {/* --- 3. VOUCHER TERMINAL --- */}
                {cartItems.length > 0 && (
                    <motion.div
                        layout
                        className="bg-black/40 border border-white/5 rounded-[24px] p-1 flex items-center"
                    >
                        <div className="w-10 h-10 rounded-[20px] bg-white/5 flex items-center justify-center text-zinc-500">
                            <Ticket size={16} />
                        </div>
                        <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => { setCouponInput(e.target.value); setCouponStatus('idle'); }}
                            placeholder="PROMO_CODE..."
                            className="flex-1 bg-transparent px-3 text-[11px] font-mono text-white placeholder:text-zinc-700 uppercase outline-none"
                        />
                        <button
                            onClick={handleApplyCoupon}
                            disabled={couponStatus === 'success'}
                            className={`px-4 py-2 rounded-[18px] text-[9px] font-black uppercase tracking-widest transition-all
                                ${couponStatus === 'success'
                                    ? 'bg-emerald-500 text-black'
                                    : couponStatus === 'error'
                                        ? 'bg-rose-500 text-white'
                                        : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            {couponStatus === 'success' ? 'ACTIVE' : 'APPLY'}
                        </button>
                    </motion.div>
                )}

                {/* --- 4. THE RECEIPT (Digital Ledger) --- */}
                {cartItems.length > 0 && (
                    <section className="relative overflow-hidden pt-4">
                        {/* Receipt Top Edge Decoration */}
                        <div className="absolute top-4 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-50" />

                        <div className="bg-[#050505] border border-white/10 rounded-[30px] p-6 space-y-4 shadow-2xl relative">
                            {/* Background Texture */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase">SUBTOTAL</span>
                                <div className="h-[1px] flex-1 mx-4 bg-zinc-800 border-b border-dashed border-zinc-900" />
                                <span className="text-xs font-mono text-white">{subtotal.toFixed(2)} TON</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase">GAS_FEE</span>
                                <div className="h-[1px] flex-1 mx-4 bg-zinc-800 border-b border-dashed border-zinc-900" />
                                <span className="text-xs font-mono text-amber-500">+{protocolFee} TON</span>
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-emerald-500 uppercase">DISCOUNT</span>
                                    <div className="h-[1px] flex-1 mx-4 bg-zinc-800 border-b border-dashed border-zinc-900" />
                                    <span className="text-xs font-mono text-emerald-500">-{discountAmount.toFixed(2)} TON</span>
                                </div>
                            )}

                            <div className="my-4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Total_Due</span>
                                    <span className="text-[8px] font-mono text-zinc-500">
                                        SECURE_ENCRYPTION_ID: #88291
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-white tracking-tighter shadow-white drop-shadow-sm">
                                        {total.toFixed(2)}
                                    </span>
                                    <span className="text-[10px] font-bold text-zinc-500">TON</span>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* Note: Sticky Button is removed because we use Telegram MainButton now */}
            {/* But if you are testing on web, you might want a fallback button here */}
            {typeof window !== 'undefined' && !WebApp?.initDataUnsafe?.user && (
                <div className="fixed bottom-0 inset-x-0 p-4 z-50 bg-gradient-to-t from-black via-black to-transparent">
                    <button
                        onClick={handleCheckout}
                        className="w-full h-14 bg-emerald-500 text-black font-black text-lg rounded-full uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                    >
                        PAY {total.toFixed(2)} TON
                    </button>
                </div>
            )}
        </div>
    );
}