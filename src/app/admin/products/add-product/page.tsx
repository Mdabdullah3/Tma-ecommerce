/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, Zap, Image as ImageIcon, Scan, Tag } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import TextInput from '@/components/form/TextInput';
import SelectInput from '@/components/form/SelectInput';
import NumberInput from '@/components/form/NumberInput';
import PrimaryButton from '@/components/form/PrimaryButton';
import ToggleSwitch from '@/components/form/ToggleSwitch';
import Background from '@/components/Background';
import { useProductStore } from '@/app/store/useProductStore';

const NFT_CATEGORIES = [
    { value: 'COLLECTIBLE', label: 'COLLECTIBLE' },
    { value: 'ART', label: 'DIGITAL ART' },
    { value: 'UTILITY', label: 'ACCESS KEY' },
    { value: 'GAMING', label: 'GAME ASSET' },
];

const ProductForm: React.FC = () => {
    const router = useRouter();
    const addProduct = useProductStore((state) => state.addProduct);

    const [formData, setFormData] = useState({
        name: '',
        category: 'COLLECTIBLE',
        priceTon: 0,
        image: '',
        isListed: true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [telegramWebApp, setTelegramWebApp] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            setTelegramWebApp(window.Telegram.WebApp);
        }
    }, []);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = "ASSET NAME REQUIRED";
        if (!formData.image.startsWith('http')) newErrors.image = "INVALID PROTOCOL";
        if (formData.priceTon <= 0) newErrors.priceTon = "VALUE CANNOT BE ZERO";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            telegramWebApp?.HapticFeedback.notificationOccurred('error');
            return;
        }

        setIsLoading(true);
        telegramWebApp?.HapticFeedback.impactOccurred('medium');

        try {
            // Simulate minting delay
            await new Promise(r => setTimeout(r, 1500));

            await addProduct({
                productId: `NFT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                name: formData.name,
                image: formData.image,
                category: formData.category,
                priceTon: Number(formData.priceTon),
                status: formData.isListed ? 'listed' : 'draft',
                views: 0,
                mintDate: new Date().toISOString()
            });

            telegramWebApp?.HapticFeedback.notificationOccurred('success');
            router.push('/admin/products');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden relative pb-32">
            <Background />
            <PageHeader title="CREATE PRODUCT" />
            <div className="relative z-10 pt-24 max-w-xl mx-auto px-5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 relative aspect-square w-full bg-[#080808] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl group"
                >
                    {/* Scanline Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20 pointer-events-none z-20" />

                    {/* The Scanning Laser */}
                    <motion.div
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-emerald-500/50 shadow-[0_0_20px_#22d3ee] z-20 opacity-50"
                    />

                    {formData.image ? (
                        <div className="relative w-full h-full">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700 gap-3">
                            <Scan size={48} strokeWidth={1} />
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase">No_Signal</span>
                        </div>
                    )}

                    {/* Metadata Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 z-30">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded bg-emerald-900/30 border border-emerald-500/30 text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                                {formData.category}
                            </span>
                            {formData.priceTon > 0 && (
                                <span className="px-2 py-1 rounded bg-emerald-900/30 border border-emerald-500/30 text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                                    {formData.priceTon} TON
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter uppercase text-white truncate">
                            {formData.name || "UNTITLED_ASSET"}
                        </h3>
                    </div>
                </motion.div>

                {/* --- 2. DATA ENTRY FORM --- */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-4 p-1">
                        <TextInput
                            label="Metadata Source"
                            name="image"
                            icon={ImageIcon}
                            placeholder="HTTPS://IPFS..."
                            value={formData.image}
                            onChange={handleChange}
                            errorMessage={errors.image}
                        />

                        <TextInput
                            label="Asset Designation"
                            name="name"
                            icon={Tag}
                            placeholder="E.G. CYBER_PUNK_V2"
                            value={formData.name}
                            onChange={handleChange}
                            errorMessage={errors.name}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <NumberInput
                                label="Floor Price"
                                name="priceTon"
                                value={formData.priceTon}
                                onChange={handleChange}
                                errorMessage={errors.priceTon}
                            />
                            <SelectInput
                                label="Asset Class"
                                name="category"
                                options={NFT_CATEGORIES}
                                value={formData.category}
                                onChange={handleChange}
                            />
                        </div>

                        <ToggleSwitch
                            label="Market Visibility"
                            name="isListed"
                            checked={formData.isListed}
                            onChange={(val) => setFormData(p => ({ ...p, isListed: val }))}
                        />
                    </div>

                    <div className="pt-4 pb-12">
                        <PrimaryButton
                            label={isLoading ? "Forging..." : "Mint Asset"}
                            icon={isLoading ? Sparkles : Zap}
                            type="submit"
                            isLoading={isLoading}
                        />
                        <p className="text-center mt-4 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                            Action is irreversible on Mainnet
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;