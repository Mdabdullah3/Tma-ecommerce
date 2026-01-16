/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Upload, Sparkles, Link as LinkIcon, Eye,
    ShieldCheck, Zap, Globe, Info
} from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import TextInput from '@/components/form/TextInput';
import SelectInput from '@/components/form/SelectInput';
import NumberInput from '@/components/form/NumberInput';
import PrimaryButton from '@/components/form/PrimaryButton';
import Background from '@/components/Background';
import { useProductStore } from '@/app/store/useProductStore';
import ToggleSwitch from '@/components/form/ToggleSwitch';

// Constants
const NFT_CATEGORIES = [
    { value: 'COLLECTIBLE', label: 'COLLECTIBLE' },
    { value: 'ART', label: 'ART' },
    { value: 'UTILITY', label: 'UTILITY' },
    { value: 'GAMING', label: 'GAMING' },
];

const ProductForm: React.FC = () => {
    const router = useRouter();
    const addProduct = useProductStore((state) => state.addProduct);

    const [formData, setFormData] = useState({
        nftName: '',
        category: 'COLLECTIBLE',
        priceTon: 0,
        imageUrl: '',
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
        if (!formData.nftName) newErrors.nftName = "REQUIRED_FIELD";
        if (!formData.imageUrl.startsWith('http')) newErrors.imageUrl = "INVALID_URL_PROTOCOL";
        if (formData.priceTon <= 0) newErrors.priceTon = "INVALID_PRICE";
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
            await addProduct({
                productId: `NFT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                name: formData.nftName,
                image: formData.imageUrl,
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
        <div className="min-h-screen bg-black text-white relative p-6 pb-32">
            <Background />
            <PageHeader title="MINT_STATION" />

            <div className="relative z-10 pt-20 max-w-2xl mx-auto">
                {/* LIVE PREVIEW CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-zinc-900 to-black shadow-2xl"
                >
                    <div className="aspect-square w-full relative bg-zinc-900 flex items-center justify-center group">
                        {formData.imageUrl ? (
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-zinc-700 flex flex-col items-center gap-2">
                                <Sparkles size={48} className="animate-pulse" />
                                <span className="text-[10px] font-black tracking-[0.2em]">AWAITING_ASSET_URL</span>
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-black/40 p-4 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-blue-400 font-bold mb-1 tracking-widest uppercase">{formData.category || "CATEGORY"}</p>
                            <h3 className="text-xl font-black italic tracking-tighter uppercase">{formData.nftName || "NFT_IDENTITY"}</h3>
                        </div>
                    </div>
                </motion.div>

                {/* FORM FIELDS */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <TextInput
                            label="METADATA_IMAGE_URL"
                            name="imageUrl"
                            placeholder="https://ipfs.io/ipfs/..."
                            value={formData.imageUrl}
                            onChange={handleChange}
                            errorMessage={errors.imageUrl}
                        />

                        <TextInput
                            label="ASSET_NAME"
                            name="nftName"
                            placeholder="e.g. CYBER_PUNK_#001"
                            value={formData.nftName}
                            onChange={handleChange}
                            errorMessage={errors.nftName}
                        />


                        <div className="grid grid-cols-2 gap-4">
                            <NumberInput
                                label="LISTING_PRICE (TON)"
                                name="priceTon"
                                value={formData.priceTon}
                                onChange={handleChange}
                                errorMessage={errors.priceTon}
                            />
                            <SelectInput
                                label="CLASS"
                                name="category"
                                options={NFT_CATEGORIES}
                                value={formData.category}
                                onChange={handleChange}
                            />
                        </div>

                        

                        <div className="bg-[#1a1a2e]/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                    <Globe size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold">PUBLIC_VISIBILITY</p>
                                    <p className="text-[9px] text-zinc-500">LIST ON MARKETPLACE IMMEDIATELY</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                label="LISTED"
                                name="isListed"
                                checked={formData.isListed}
                                onChange={(val) => setFormData(p => ({ ...p, isListed: val }))}
                            />
                        </div>
                    </div>

                    <PrimaryButton
                        label={"CONFIRM_MINT_REQUEST"}
                        icon={Zap}
                        type="submit"
                        isLoading={isLoading}
                    />
                </form>
            </div>
        </div>
    );
};

export default ProductForm;