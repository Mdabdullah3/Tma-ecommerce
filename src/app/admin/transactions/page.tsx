/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/transactions/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Background from '@/components/Background';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Hash, DollarSign, Calendar, User, ShoppingBag, Eye, ExternalLink } from 'lucide-react';
import { Loader2 } from 'lucide-react';
interface Transaction {
    id: string;
    nftName: string;
    buyerTgId: string;
    buyerUsername: string;
    priceTon: number;
    date: string; // YYYY-MM-DD HH:MM:SS
    transactionHash: string; // TON transaction hash
}

// Dummy transaction data
const dummyTransactions: Transaction[] = [
    {
        id: 'tx001', nftName: 'QUANTUM_REALM_KEY', buyerTgId: '12345678', buyerUsername: 'crypto_dev',
        priceTon: 5.2, date: '2023-11-15 14:30:00', transactionHash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz567',
    },
    {
        id: 'tx002', nftName: 'AETHERIAL BLOSSOM V2.0', buyerTgId: '87654321', buyerUsername: 'nft_enthusiast',
        priceTon: 8.9, date: '2023-11-14 10:00:00', transactionHash: '0xdef456ghi789jkl012mno345pqr678stu901vwx234yz567abc1',
    },
    {
        id: 'tx003', nftName: 'METAVERSE LAND PLOT #34', buyerTgId: '11223344', buyerUsername: 'virtual_investor',
        priceTon: 15.0, date: '2023-11-13 18:45:00', transactionHash: '0xghi789jkl012mno345pqr678stu901vwx234yz567abc1def4',
    },
    {
        id: 'tx004', nftName: 'CYBERPUNK CITYSCAPE', buyerTgId: '55667788', buyerUsername: 'digital_art_lover',
        priceTon: 3.5, date: '2023-11-12 09:15:00', transactionHash: '0xjkl012mno345pqr678stu901vwx234yz567abc1def4ghi7',
    },
];

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [telegramWebApp, setTelegramWebApp] = useState<any>(null); // State for WebApp

    useEffect(() => {
        // Dynamically load WebApp SDK
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
            setTelegramWebApp(window.Telegram.WebApp);
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }

        // Simulate fetching transactions
        const fetchTransactions = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
            setTransactions(dummyTransactions); // Replace with actual API call
            setLoading(false);
        };
        fetchTransactions();
    }, []);

    const handleViewTransaction = (hash: string) => {
        const tonExplorerUrl = `https://tonscan.org/tx/${hash}`; // Example TON explorer URL
        if (telegramWebApp) {
            telegramWebApp.openLink(tonExplorerUrl);
        } else {
            window.open(tonExplorerUrl, '_blank');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0, scale: 0.98 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 150,
                damping: 15,
                mass: 0.8
            }
        }
    };
    console.log(transactions);
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#01030d] to-[#04081c] text-white font-sans relative p-6 pb-24 overflow-hidden">
            <Background />
            <PageHeader title="ORDER_TRANSACTIONS" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative z-10 pt-20 space-y-6"
            >
                {loading ? (
                    <motion.div variants={itemVariants} className="text-center text-zinc-500 py-10">
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="inline-block"
                        >
                            <Loader2 size={24} />
                        </motion.span>
                        <p className="mt-2">Loading transactions...</p>
                    </motion.div>
                ) : transactions.length === 0 ? (
                    <motion.div variants={itemVariants} className="text-center text-zinc-500 py-10">
                        <Package size={48} className="mx-auto text-zinc-700 mb-4" />
                        <h3 className="text-lg font-bold">No Transactions Found</h3>
                        <p className="text-sm">It looks like there haven&apos;t been any NFT sales yet.</p>
                    </motion.div>
                ) : (
                    <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
                        {transactions.map((tx, index) => (
                            <motion.div
                                key={tx.id}
                                initial="hidden"
                                animate="visible"
                                variants={itemVariants}
                                transition={{ delay: 0.05 * index }}
                                className="bg-[#0c0c0c]/50 border border-white/10 rounded-xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden
                                           hover:border-primary-accent/50 hover:shadow-primary-accent/20 transition-all duration-300 group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.01] to-transparent animate-scanline pointer-events-none" />

                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <h3 className="text-base font-bold text-white uppercase tracking-wider">{tx.nftName}</h3>
                                    <span className="text-sm font-extrabold text-primary-light flex items-center gap-1">
                                        <DollarSign size={16} />{tx.priceTon} TON
                                    </span>
                                </div>

                                <div className="text-xs text-zinc-400 space-y-1 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-zinc-500" />
                                        <span>Buyer: <span className="text-white font-medium">{tx.buyerUsername} ({tx.buyerTgId})</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-zinc-500" />
                                        <span>Date: {new Date(tx.date).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-primary-light transition-colors" onClick={() => handleViewTransaction(tx.transactionHash)}>
                                        <Hash size={14} className="text-zinc-500" />
                                        <span>Tx Hash: <span className="font-mono text-white/80 group-hover:underline">...{tx.transactionHash.slice(-8)}</span></span>
                                        <ExternalLink size={14} className="text-zinc-600 group-hover:text-primary-light ml-auto" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
