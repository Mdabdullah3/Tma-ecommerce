// components/ProductManager.tsx - REVISED FOR "WOW" DESIGN
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Filter, Image, Tag, DollarSign, Edit, Trash2, Box,
    List, Grid, TrendingUp, Sparkles, XCircle, CheckCircle, Layers, Bitcoin, Sliders, Eye,
    Backpack
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Background from '@/components/Background';
import Link from 'next/link';

interface NFTProduct {
    id: string;
    name: string;
    image: string; // URL to the NFT image
    category: string;
    priceTon: number; // Price in TON
    status: 'listed' | 'draft' | 'sold';
    views: number; // New: for richer data
    mintDate: string; // New: for richer data
}

const dummyProducts: NFTProduct[] = [
    {
        id: 'nft001',
        name: 'CYBERPUNK SENTINEL #734',
        image: 'https://cdn-icons-png.flaticat.com/512/3592/3592182.png', // More iconic image
        category: 'COLLECTIBLE',
        priceTon: 15.5,
        status: 'listed',
        views: 1245,
        mintDate: '2023-10-26',
    },
    {
        id: 'nft002',
        name: 'AETHERIAL BLOSSOM V2.0',
        image: 'https://cdn-icons-png.flaticon.com/512/3655/3655113.png',
        category: 'ART',
        priceTon: 8.2,
        status: 'listed',
        views: 890,
        mintDate: '2023-11-01',
    },
    {
        id: 'nft003',
        name: 'QUANTUM REALM KEY-ALPHA',
        image: 'https://cdn-icons-png.flaticon.com/512/3592/3592167.png',
        category: 'UTILITY',
        priceTon: 22.0,
        status: 'draft',
        views: 312,
        mintDate: '2023-11-15',
    },
    {
        id: 'nft004',
        name: 'GALACTIC WANDERER MAP',
        image: 'https://cdn-icons-png.flaticon.com/512/3592/3592187.png',
        category: 'GAMING',
        priceTon: 5.9,
        status: 'sold',
        views: 2001,
        mintDate: '2023-09-01',
    },
    {
        id: 'nft005',
        name: 'MYSTIC ORB OF ZYLOS-IX',
        image: 'https://cdn-icons-png.flaticon.com/512/3592/3592180.png',
        category: 'COLLECTIBLE',
        priceTon: 12.0,
        status: 'listed',
        views: 765,
        mintDate: '2023-10-05',
    },
    {
        id: 'nft006',
        name: 'NEURAL CONSTRUCT-ZERO',
        image: 'https://cdn-icons-png.flaticon.com/512/3592/3592176.png',
        category: 'COLLECTIBLE',
        priceTon: 30.0,
        status: 'listed',
        views: 1800,
        mintDate: '2023-12-01',
    },
];

const ProductManager: React.FC = () => {
    const [products, setProducts] = useState<NFTProduct[]>(dummyProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null); // Ref for closing filter on outside click

    const categories = ['ALL', ...Array.from(new Set(dummyProducts.map(p => p.category)))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'ALL' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Summary metrics calculation
    const totalNFTs = products.length;
    const listedNFTs = products.filter(p => p.status === 'listed').length;
    const totalTonValue = products.reduce((sum, p) => sum + p.priceTon, 0);

    // Close filter options when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilterOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);





    const handleDeleteProduct = (id: string) => {

    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04, // Faster stagger
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0, scale: 0.98 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 180,
                damping: 18,
                mass: 0.9
            }
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#000000] to-[#0a101f] text-white relative p-6 pb-24 overflow-hidden">
            <Background />
            <PageHeader title="NFT_CATALOG" />
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative z-10 pt-16 space-y-4"
            >
                {/* Product Summary Cards - More "data-rich" design */}
                <motion.section variants={itemVariants} className="w-full">
                    <h2 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-3 px-2  pl-2">SYSTEM_METRICS</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <motion.div variants={itemVariants} className="relative bg-[#1a1a2e]/60 border border-blue-800/20 rounded-2xl p-4 flex flex-col items-start shadow-xl backdrop-blur-lg overflow-hidden group">

                            <div className="flex items-center gap-2 text-blue-400 mb-2 relative z-10">
                                <Layers size={16} strokeWidth={2} className="text-blue-500" />
                                <span className="text-[8px] font-bold uppercase tracking-wider text-blue-300">TOTAL_NFTS</span>
                            </div>
                            <span className="text-2xl font-extrabold italic text-white tracking-tight relative z-10">{totalNFTs}</span>
                            <div className="absolute bottom-0 right-0 p-2 text-blue-900 text-6xl font-extrabold opacity-20 transform rotate-12 translate-x-1/4 translate-y-1/4 select-none group-hover:opacity-30 transition-opacity">{totalNFTs}</div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="relative bg-[#1a1a2e]/60 border border-green-800/20 rounded-2xl p-4 flex flex-col items-start shadow-xl backdrop-blur-lg overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="flex items-center gap-2 text-green-400 mb-2 relative z-10">
                                <List size={16} strokeWidth={2} className="text-green-500" />
                                <span className="text-[8px] font-bold uppercase tracking-wider text-green-300">LISTED_ACTIVE</span>
                            </div>
                            <span className="text-2xl font-extrabold italic text-white tracking-tight relative z-10">{listedNFTs}</span>
                            <div className="absolute bottom-0 right-0 p-2 text-green-900 text-6xl font-extrabold opacity-20 transform rotate-12 translate-x-1/4 translate-y-1/4 select-none group-hover:opacity-30 transition-opacity">{listedNFTs}</div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="relative bg-[#1a1a2e]/60 border border-amber-800/20 rounded-2xl p-4 flex flex-col items-start shadow-xl backdrop-blur-lg col-span-2 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="flex items-center gap-2 text-amber-400 mb-2 relative z-10">
                                <Bitcoin size={16} strokeWidth={2} className="text-amber-500" /> {/* Changed to Bitcoin icon for TON value */}
                                <span className="text-[8px] font-bold uppercase tracking-wider text-amber-300">TOTAL_MARKET_CAP</span>
                            </div>
                            <span className="text-2xl font-extrabold italic text-white tracking-tight relative z-10">
                                {totalTonValue.toFixed(1)} TON
                                <span className="ml-2 text-sm text-zinc-600 font-light">(${(totalTonValue * 2.5).toFixed(2)})</span> {/* Assuming 1 TON = $2.5 */}
                            </span>
                        </motion.div>
                    </div>
                </motion.section>
                <motion.section variants={itemVariants} className="w-full flex items-center gap-3">
                    <div className="relative grow">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500/70" />
                        <input
                            type="text"
                            placeholder="SEARCH NFT_ID / NAME..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1a1a2e]/60 border border-white/10 text-white placeholder-zinc-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-xs font-mono tracking-wider transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <motion.div ref={filterRef} className="relative"> {/* Wrap in div for ref */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowFilterOptions(!showFilterOptions)}
                            className="p-3 bg-[#1a1a2e]/60 border border-white/10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-primary hover:border-primary/50 transition-all relative"
                        >
                            <Sliders size={18} />
                            {showFilterOptions && <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping-small" />}
                        </motion.button>
                        <AnimatePresence>
                            {showFilterOptions && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full mt-2 right-0 bg-[#1a1a2e] border border-fuchsia-800/30 rounded-lg shadow-2xl py-2 z-20 min-w-[160px] backdrop-blur-md"
                                >
                                    {categories.map(cat => (
                                        <motion.button
                                            key={cat}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => { setFilterCategory(cat); setShowFilterOptions(false); }}
                                            className="w-full text-left px-4 py-2 text-xs font-bold uppercase hover:bg-white/5 transition-colors
                                                       flex items-center justify-between text-zinc-400 hover:text-white"
                                        >
                                            {cat}
                                            {filterCategory === cat && <CheckCircle size={14} className="text-primary" />}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                    <Link href="/admin/products/add-product" >
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-linear-to-br from-primary/80 to-primary/40 border border-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/40 hover:from-primary hover:to-primary/60 transition-all"
                        >
                            <Plus size={18} />
                        </motion.button>
                    </Link>
                </motion.section>

                {/* Product List - Detailed and Interactive Cards */}
                <motion.section variants={itemVariants} className="w-full">
                    <h2 className="text-xs font-bold  uppercase text-zinc-500 tracking-wider mb-3 px-2 pl-2">NFT_LISTING ({filteredProducts.length})</h2>
                    <div className="space-y-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    variants={itemVariants}
                                    transition={{ delay: 0.02 * index }}
                                    className="relative bg-[#1a1a2e]/60 border border-white/10 rounded-2xl p-4 flex items-center gap-4
                                               shadow-xl backdrop-blur-lg group hover:border-primary/40 transition-all duration-300 overflow-hidden cursor-pointer"
                                >
                                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/20 flex-shrink-0 relative z-10 bg-zinc-900 flex items-center justify-center">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300 scale-90 group-hover:scale-100" />
                                        {/* Subtle badge for status */}
                                        <div className={`absolute -bottom-1 -right-1 text-[8px] px-2 py-0.5 rounded-full font-bold
                                                        ${product.status === 'listed' ? 'bg-green-600 text-white' :
                                                product.status === 'draft' ? 'bg-amber-600 text-white' :
                                                    'bg-rose-600 text-white'}`}
                                        >
                                            {product.status.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex-grow relative z-10">
                                        <h3 className="text-sm font-extrabold italic uppercase text-white leading-tight">
                                            {product.name}
                                        </h3>
                                        <p className="text-[9px] font-mono text-zinc-500 tracking-wide mt-1 flex items-center gap-2">
                                            <Tag size={10} className="text-zinc-600" /> {product.category}
                                            <span className="text-zinc-700">•</span>
                                            <Eye size={10} className="text-zinc-600" /> {product.views.toLocaleString()} VIEWS
                                        </p>
                                        <p className="text-md font-extrabold text-primary mt-2 flex items-center gap-1">
                                            <DollarSign size={16} className="text-primary" /> {product.priceTon.toFixed(1)} TON
                                            <span className="text-xs text-zinc-600 font-light ml-2">({product.mintDate})</span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2 relative z-10  duration-300 transform ">
                                        <Link href={`/admin/products/edit-product/${product.id}`}>
                                            <motion.button
                                                whileTap={{ scale: 0.8 }}
                                                className="p-2 bg-white/5 border border-white/10 rounded-full text-zinc-400 hover:text-white hover:bg-primary/80 transition-all shadow-md"
                                                title="Edit Product"
                                            >
                                                <Edit size={16} />
                                            </motion.button>
                                        </Link>
                                        <motion.button
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="p-2 bg-white/5 border border-white/10 rounded-full text-zinc-400 hover:text-white hover:bg-rose-600 transition-all shadow-md"
                                            title="Delete Product"
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </div>

                                </motion.div>
                            ))
                        ) : (
                            <motion.div variants={itemVariants} className="text-center py-10 text-zinc-600 text-sm italic border border-white/5 rounded-xl bg-[#1a1a2e]/60 backdrop-blur-lg">
                                <Sparkles size={20} className="mx-auto mb-2 text-zinc-700" />
                                No NFT records found in the current registry.
                            </motion.div>
                        )}
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default ProductManager;