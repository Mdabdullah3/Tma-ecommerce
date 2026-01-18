/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2, Ticket,
    ShieldCheck, Zap, Server, ChevronRight, AlertCircle, Terminal, X
} from 'lucide-react';
import Background from '@/components/Background';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { useRouter } from 'next/navigation';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import PageHeader from '@/components/PageHeader';

// --- REMOVE THE TOP-LEVEL IMPORT ---
// import WebApp from '@twa-dev/sdk'; <--- CAUSES THE CRASH

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

    // State to hold the dynamically imported WebApp
    const [webApp, setWebApp] = useState<any>(null);

    // Calculations
    const subtotal = cartItems.reduce((acc, item) => acc + item.priceTon, 0);
    const protocolFee = 0.05;
    const discountAmount = subtotal * discount;
    const total = Math.max(0, subtotal + protocolFee - discountAmount);

    // --- 1. DYNAMICALLY LOAD TELEGRAM SDK ---
    useEffect(() => {
        const initWebApp = async () => {
            if (typeof window !== 'undefined') {
                try {
                    // Dynamic import prevents server-side crash
                    const app = (await import('@twa-dev/sdk')).default;
                    app.ready();
                    setWebApp(app);
                } catch (e) {
                    console.error("Telegram SDK failed to load", e);
                }
            }
        };
        initWebApp();
    }, []);

    // --- 2. TELEGRAM BUTTON LOGIC (Dependent on webApp state) ---
    useEffect(() => {
        if (webApp && cartItems.length > 0) {
            const btnText = isOrdering
                ? "INITIALIZING..."
                : !userWalletAddress && !isDemoMode
                    ? "LINK WALLET"
                    : `INITIATE TRANSFER (${total.toFixed(2)} TON)`;

            webApp.MainButton.setText(btnText);
            webApp.MainButton.show();
            // emerald/Black Theme
            webApp.MainButton.setParams({ color: '#06b6d4', text_color: '#000000' });

            const handleMainBtnClick = () => handleCheckout();
            webApp.MainButton.onClick(handleMainBtnClick);

            return () => {
                webApp.MainButton.offClick(handleMainBtnClick);
                webApp.MainButton.hide();
            };
        } else if (webApp) {
            webApp.MainButton.hide();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartItems, total, userWalletAddress, isDemoMode, isOrdering, webApp]); // Add webApp to dependency

    const handleApplyCoupon = () => {
        const code = couponInput.toUpperCase().trim();
        if (VALID_COUPONS[code]) {
            setDiscount(VALID_COUPONS[code]);
            setCouponStatus('success');
            webApp?.HapticFeedback.notificationOccurred('success');
        } else {
            setDiscount(0);
            setCouponStatus('error');
            webApp?.HapticFeedback.notificationOccurred('error');
            setTimeout(() => setCouponStatus('idle'), 2000);
        }
    };

    const handleCheckout = async () => {
        if (!userWalletAddress && !isDemoMode) {
            tonConnectUI.openModal();
            return;
        }

        try {
            if (!isDemoMode) {
                const response = await fetch(`https://toncenter.com/api/v2/getAddressInformation?address=${userWalletAddress}`);
                const data = await response.json();
                if (!data.ok) throw new Error("Chain sync error");
                const balanceTon = parseInt(data.result.balance) / 1000000000;

                if (balanceTon < total) {
                    webApp?.HapticFeedback.notificationOccurred('error');
                    webApp?.showAlert(`INSUFFICIENT FUNDS. You have ${balanceTon.toFixed(2)} TON.`);
                    return;
                }
            }

            const telegramUser = webApp?.initDataUnsafe?.user;

            const orderData = {
                user: telegramUser?.id?.toString() || "USER",
                walletAddress: isDemoMode ? "DEMO" : userWalletAddress,
                products: cartItems.map(i => ({ productId: i._id, name: i.name, priceTon: i.priceTon, image: i.image })),
                totalAmount: Number(total.toFixed(2)),
                status: isDemoMode ? "DEMO" : "PENDING"
            };

            await placeOrder(orderData);

            if (webApp) webApp.HapticFeedback.notificationOccurred('success');

            clearCart();
            router.push('/profile');

        } catch (error) {
            console.error(error);
            webApp?.showAlert("Transaction failed. Check network.");
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500 pb-20 font-sans">
            <Background />
            <PageHeader title="Cart Checkout" />    
            <main className="relative z-10 pt-24 px-4 space-y-6">

                {/* --- 2. MODE SWITCH (Neon Toggle) --- */}
                <div
                    onClick={() => setIsDemoMode(!isDemoMode)}
                    className="relative overflow-hidden rounded-[20px] bg-zinc-900 border border-white/5 p-1 cursor-pointer group"
                >
                    {/* Active Background Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 transition-opacity duration-500 ${isDemoMode ? 'opacity-100' : 'opacity-0'}`} />

                    <div className="relative flex items-center justify-between px-4 py-3">
                        <div className="flex flex-col">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDemoMode ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                {isDemoMode ? 'SIMULATION_ACTIVE' : 'LIVE_NETWORK'}
                            </span>
                            <span className="text-[8px] font-mono text-zinc-500">
                                {isDemoMode ? 'VIRTUAL FUNDS / NO GAS' : 'REAL TONCOIN / GAS FEES'}
                            </span>
                        </div>
                        {/* The Switch */}
                        <div className={`w-10 h-5 rounded-full border border-white/10 relative transition-colors ${isDemoMode ? 'bg-emerald-900/50' : 'bg-black'}`}>
                            <motion.div
                                animate={{ x: isDemoMode ? 20 : 2 }}
                                className={`absolute top-0.5 w-3.5 h-3.5 rounded-full shadow-lg ${isDemoMode ? 'bg-emerald-400 box-shadow-[0_0_10px_#22d3ee]' : 'bg-zinc-600'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* --- 3. INVENTORY ITEMS (Holographic Slates) --- */}
                <section className="space-y-3">
                    <AnimatePresence mode='popLayout'>
                        {cartItems.length > 0 ? cartItems.map((item, i) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, x: 100 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative h-24"
                            >
                                {/* Glowing Border on Hover */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500 via-purple-500 to-transparent rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

                                <div className="absolute inset-0 bg-[#080808] border border-white/10 rounded-[24px] overflow-hidden flex items-center pr-4">

                                    {/* Big Image Section */}
                                    <div className="relative w-24 h-full border-r border-white/5">
                                        <img src={item.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Asset" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex-1 pl-4 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[7px] font-mono text-emerald-400 uppercase">
                                                ERC-721
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-wider truncate max-w-[150px]">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs font-bold text-zinc-400">VALUED AT</span>
                                            <span className="text-sm font-black text-white">{item.priceTon} TON</span>
                                        </div>
                                    </div>

                                    {/* Delete Button (Hidden until hover/tap) */}
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-rose-500 hover:border-rose-500 hover:bg-rose-500/10 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="py-16 border border-dashed border-zinc-800 rounded-[30px] flex flex-col items-center justify-center gap-4 opacity-40">
                                <Zap size={32} />
                                <span className="text-[10px] font-black uppercase tracking-widest">SYSTEM_EMPTY</span>
                            </div>
                        )}
                    </AnimatePresence>
                </section>

                {/* --- 4. COUPON COMMAND LINE --- */}
                {cartItems.length > 0 && (
                    <div className="relative bg-black border border-white/10 rounded-[18px] p-1 flex items-center">
                        <div className="pl-3 pr-2 text-zinc-500">
                            <Ticket size={16} />
                        </div>
                        <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => { setCouponInput(e.target.value); setCouponStatus('idle'); }}
                            placeholder="INPUT_ACCESS_CODE"
                            className="flex-1 bg-transparent py-3 text-[10px] font-mono text-emerald-400 placeholder:text-zinc-700 uppercase outline-none"
                        />
                        <button
                            onClick={handleApplyCoupon}
                            disabled={couponStatus === 'success'}
                            className={`px-4 py-2 rounded-[14px] text-[8px] font-black uppercase tracking-widest transition-all
                                ${couponStatus === 'success' ? 'bg-green-500 text-black' : 'bg-white/10 text-white hover:bg-white hover:text-black'}`}
                        >
                            {couponStatus === 'success' ? 'UNLOCKED' : 'EXECUTE'}
                        </button>
                    </div>
                )}

                {/* --- 5. THE SETTLEMENT PANEL (Footer) --- */}
                {cartItems.length > 0 && (
                    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-zinc-900 to-black border border-white/10 p-6 shadow-2xl">

                        {/* Animated Grid Background */}
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

                        {/* Content */}
                        <div className="relative z-10 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                                <span>NET_ASSETS</span>
                                <span className="text-white">{subtotal.toFixed(2)} TON</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                                <span>NETWORK_GAS</span>
                                <span className="text-emerald-600">+{protocolFee} TON</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between items-center text-[10px] font-mono text-purple-400">
                                    <span>VOUCHER_CODE</span>
                                    <span>-{discountAmount.toFixed(2)} TON</span>
                                </div>
                            )}

                            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />

                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1">Total Settlement</span>
                                    <div className="flex items-center gap-1">
                                        <ShieldCheck size={10} className="text-emerald-400" />
                                        <span className="text-[9px] font-bold text-emerald-400 uppercase">Secure</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-4xl font-black italic text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                        {total.toFixed(2)}
                                    </span>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        TONCOIN
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="fixed bottom-0 inset-x-0 p-4 z-50 bg-gradient-to-t from-black via-black to-transparent">
                    <button
                        onClick={handleCheckout}
                        className="w-full h-14 bg-emerald-500 text-black font-black text-lg rounded-full uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                    >
                        PAY {total.toFixed(2)} TON
                    </button>
                </div>

            </main>
        </div>
    );
}