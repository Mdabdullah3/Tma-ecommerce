"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Layers, Bitcoin, Sliders, Eye } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Background from '@/components/Background';
import Link from 'next/link';
import { useProductStore } from '@/app/store/useProductStore';

const ProductManager: React.FC = () => {
    const { products, loading, fetchProducts, deleteProduct } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'ALL' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const totalTonValue = products.reduce((sum, p) => sum + p.priceTon, 0);

    return (
        <div className="min-h-screen bg-black text-white relative p-6 pb-24 overflow-hidden">
            <Background />
            <PageHeader title="NFT_CATALOG" />

            <motion.div initial="hidden" animate="visible" className="relative z-10 pt-16 space-y-6">

                {/* METRICS SECTION */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#1a1a2e]/60 border border-blue-800/20 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-blue-400 mb-1">
                            <Layers size={14} />
                            <span className="text-[10px] font-bold">TOTAL_ASSETS</span>
                        </div>
                        <span className="text-2xl font-black italic">{products.length}</span>
                    </div>
                    <div className="bg-[#1a1a2e]/60 border border-amber-800/20 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-amber-400 mb-1">
                            <Bitcoin size={14} />
                            <span className="text-[10px] font-bold">TOTAL_VALUE</span>
                        </div>
                        <span className="text-2xl font-black italic">{totalTonValue.toFixed(1)} <span className="text-xs">TON</span></span>
                    </div>
                </div>

                {/* SEARCH & FILTER */}
                <div className="flex gap-2">
                    <div className="relative grow">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1a1a2e]/60 border border-white/10 text-xs font-mono focus:border-blue-500 outline-none"
                            placeholder="SEARCH REGISTRY..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={() => setShowFilterOptions(!showFilterOptions)} className="p-3 bg-[#1a1a2e]/60 border border-white/10 rounded-xl">
                        <Sliders size={18} />
                    </button>
                    <Link href="/admin/products/add-product">
                        <button className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/40"><Plus size={18} /></button>
                    </Link>
                </div>

                {/* LISTING SECTION */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-20 font-mono text-blue-500 animate-pulse">SYNCING_DATABASE...</div>
                    ) : filteredProducts.map((product) => (
                        <motion.div layout key={product.productId} className="bg-[#1a1a2e]/60 border border-white/10 rounded-2xl p-4 flex items-center gap-4 group">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-black border border-white/5">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="grow">
                                <h3 className="text-sm font-bold italic uppercase">{product.name}</h3>
                                <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500 font-mono">
                                    <span className="flex items-center gap-1"><Eye size={10} /> {product.views}</span>
                                    <span>{product.category}</span>
                                </div>
                                <div className="text-blue-400 font-black text-sm mt-1">{product.priceTon} TON</div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link href={`/admin/products/edit-product/${product?._id}`} className="p-2 bg-gray-500/20 hover:bg-primary rounded-full hover:text-white transition-all">
                                    <Edit size={14} />
                                </Link>
                                <button onClick={() => deleteProduct(product?._id)} className="p-2 bg-rose-900/20 text-rose-500 rounded-full hover:bg-rose-600 hover:text-white transition-all">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
export default ProductManager;