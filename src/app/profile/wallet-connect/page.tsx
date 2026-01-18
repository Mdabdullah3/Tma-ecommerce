/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet, Copy,
    ExternalLink, ArrowRightLeft, ScanLine, CreditCard, Lock, Zap
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
// 👇 IMPORT TON HOOKS
import { useTonConnectUI, useTonWallet, useTonAddress } from "@tonconnect/ui-react";
import Background from "@/components/Background";
import PageHeader from "@/components/PageHeader";


export default function WalletPage() {
    const [activeNetwork, setActiveNetwork] = useState("ton");
    const [balance, setBalance] = useState<string>("0.00");
    const [loadingBalance, setLoadingBalance] = useState(false);
    // 👇 REAL WALLET HOOKS
    const wallet = useTonWallet();
    const userFriendlyAddress = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const fetchBalance = useCallback(async (address: string) => {
        if (!address) return;
        setLoadingBalance(true);
        try {
            // Using TonCenter Public API (Mainnet)
            const response = await fetch(`https://toncenter.com/api/v2/getAddressInformation?address=${address}`);
            const data = await response.json();

            if (data.ok && data.result) {
                // Balance is returned in nanotons (1 TON = 1,000,000,000 nanotons)
                const nanoBalance = data.result.balance;
                const tonBalance = (parseInt(nanoBalance) / 1000000000).toFixed(2);
                setBalance(tonBalance);
            }
        } catch (error) {
            console.error("Failed to fetch balance:", error);
            setBalance("0.00");
        } finally {
            setLoadingBalance(false);
        }
    }, []);

    // Trigger fetch when wallet connects
    useEffect(() => {
        if (userFriendlyAddress) {
            fetchBalance(userFriendlyAddress);
        }
    }, [userFriendlyAddress, fetchBalance]);
    // Function to trigger the Official Wallet Modal
    const handleConnect = () => {
        tonConnectUI.openModal();
    };

    // Function to Disconnect
    const handleDisconnect = () => {
        tonConnectUI.disconnect();
    };

    if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

    return (
        <div className="min-h-screen w-full font-sans overflow-x-hidden pb-24 relative selection:bg-cyan-500/30">

            {/* 1. BACKGROUND */}
            <div className="fixed inset-0 bg-[#050505]" />
            <Background />

            {/* Ambient Light */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#00BC7D]/10 blur-[120px] pointer-events-none" />
            <PageHeader title="Quantum Vault" subtitle="SECURE LINK" color="#00BC7D" />

            <div className="relative z-10 px-5 flex flex-col gap-8">

                {/* 4. MAIN CONTENT (Switches based on REAL Wallet state) */}
                <AnimatePresence mode="wait">
                    {!wallet ? (
                        <ConnectView key="connect" onConnect={handleConnect} network={activeNetwork} />
                    ) : (
                        <ConnectedDashboard
                            key="dashboard"
                            network={activeNetwork}
                            address={userFriendlyAddress} // Pass real address
                            onDisconnect={handleDisconnect}
                            balance={balance} // 👈 Pass real balance
                            isLoading={loadingBalance}
                        />
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

// --- COMPONENTS ---


function ConnectView({ onConnect, network }: { onConnect: () => void, network: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-6 pt-20"
        >
            {/* HERO ANIMATION */}
            <div className="relative h-40 w-full flex items-center justify-center">
                <div className="absolute w-40 h-40 border border-[#00BC7D]/20 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute w-32 h-32 border border-[#7B61FF]/30 rounded-full animate-[spin_15s_linear_infinite_reverse] border-dashed" />

                {/* Floating Shield (Clickable) */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 w-24 h-24 bg-gradient-to-br from-[#1A252B] to-[#0A0F12] rounded-[24px] border border-[#00BC7D]/40 flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.2)] group cursor-pointer"
                    onClick={onConnect}
                >
                    <div className="absolute inset-0 bg-[#00BC7D]/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Wallet className="w-10 h-10 text-[#00BC7D] drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                    <div className="absolute -bottom-3 px-3 py-1 bg-[#00BC7D] rounded-full text-[10px] font-black text-black">
                        CONNECT
                    </div>
                </motion.div>
            </div>

            <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-white">Link Your Wallet</h2>
                <p className="text-xs text-white/40 max-w-[240px] mx-auto">
                    Connect to the {network.toUpperCase()} network to enable withdrawals and trading.
                </p>
            </div>
        </motion.div>
    )
}

function ConnectedDashboard({ network, address, onDisconnect, balance, isLoading }: { network: string, address: string, onDisconnect: () => void, balance: string, isLoading: boolean }) {

    // Copy Address Logic
    const handleCopy = () => {
        navigator.clipboard.writeText(address);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6 pt-24"
        >
            {/* 1. HOLOGRAPHIC CARD (The "Black Card") */}
            <div className="w-full aspect-[1.586] rounded-[32px] relative overflow-hidden group ">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00BC7D] via-[#7B61FF] to-[#FF0080] opacity-100" />
                <div className="absolute inset-[2px] bg-[#080808] rounded-[30px] z-10" />

                <div className="absolute inset-[2px] z-20 p-6 flex flex-col justify-between overflow-hidden rounded-[30px]">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#00BC7D]/10 blur-[60px]" />

                    {/* Top Row */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <ScanLine className="w-5 h-5 text-[#00BC7D]" />
                            <span className="text-[10px] font-bold text-white tracking-widest">{network.toUpperCase()} MAINNET</span>
                        </div>
                        <Zap className="w-6 h-6 text-[#FACC15] fill-[#FACC15] animate-pulse" />
                    </div>

                    {/* Balance */}
                    <div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Total Assets</span>
                        <h2 className="text-4xl font-black text-white tracking-tight mt-1">
                            {isLoading ? "---" : balance} <span className="text-lg text-[#00BC7D]">TON</span>
                        </h2>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleCopy}>
                            {/* Format Address (EQ...123) */}
                            <span className="text-xs font-mono text-white/60">
                                {address.slice(0, 4)}...{address.slice(-4)}
                            </span>
                            <Copy className="w-3 h-3 text-[#00BC7D]" />
                        </div>
                        <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#FACC15] to-[#B45309] border border-[#FDE68A]/30 flex items-center justify-center opacity-80">
                            <div className="w-full h-[1px] bg-black/20" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ACTION GRID */}
            <div className="grid grid-cols-2 gap-3">
                <ActionButton icon={<ArrowRightLeft />} label="Swap" desc="Trade Tokens" color="text-[#FACC15]" bg="group-hover:bg-[#FACC15]/10" border="group-hover:border-[#FACC15]/30" />
                <ActionButton icon={<ExternalLink />} label="Send" desc="Transfer Assets" color="text-[#00BC7D]" bg="group-hover:bg-[#00BC7D]/10" border="group-hover:border-[#00BC7D]/30" />
                <ActionButton icon={<CreditCard />} label="Buy" desc="Credit Card" color="text-[#7B61FF]" bg="group-hover:bg-[#7B61FF]/10" border="group-hover:border-[#7B61FF]/30" />

                <button
                    onClick={onDisconnect}
                    className="p-4 rounded-[24px] bg-[#0E1216] border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 flex flex-col justify-center items-center gap-2 group transition-all"
                >
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Lock className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-center">
                        <span className="block text-xs font-bold text-white group-hover:text-red-500 transition-colors">Disconnect</span>
                        <span className="text-[9px] text-white/30">Unlink Wallet</span>
                    </div>
                </button>
            </div>
        </motion.div>
    )
}

function ActionButton({ icon, label, desc, color, bg, border }: any) {
    return (
        <button className={`
            p-4 rounded-[24px] bg-[#0E1216] border border-white/5 flex flex-col justify-center gap-3 group transition-all
            ${border} ${bg}
        `}>
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${color}`}>
                {icon}
            </div>
            <div className="text-left">
                <span className="block text-xs font-bold text-white">{label}</span>
                <span className="text-[9px] text-white/30">{desc}</span>
            </div>
        </button>
    )
}