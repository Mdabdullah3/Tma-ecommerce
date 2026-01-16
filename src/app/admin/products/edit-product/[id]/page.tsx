/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Undo2, Globe, Sparkles } from 'lucide-react';
import { useProductStore } from '@/app/store/useProductStore';

import PageHeader from '@/components/PageHeader';
import TextInput from '@/components/form/TextInput';
import SelectInput from '@/components/form/SelectInput';
import NumberInput from '@/components/form/NumberInput';
import ToggleSwitch from '@/components/form/ToggleSwitch';
import PrimaryButton from '@/components/form/PrimaryButton';
import Background from '@/components/Background';

const NFT_CATEGORIES = [
    { value: 'COLLECTIBLE', label: 'COLLECTIBLE' },
    { value: 'ART', label: 'ART' },
    { value: 'UTILITY', label: 'UTILITY' },
    { value: 'GAMING', label: 'GAMING' },
];

interface EditProductFormProps {
    onGoBack: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = () => {
    const params = useParams();
    const productId = params.id as string; // This is the MongoDB _id from URL

    const { currentProduct, fetchProductById, updateProduct, loading } = useProductStore();
    const [telegramWebApp, setTelegramWebApp] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'COLLECTIBLE',
        priceTon: 0,
        image: '',
        isListed: true,
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            setTelegramWebApp(window.Telegram.WebApp);
        }
    }, []);

    useEffect(() => {
        if (productId) fetchProductById(productId);
    }, [productId, fetchProductById]);

    // Sync store data to local form (Handling MongoDB structure)
    useEffect(() => {
        // API returns data inside a 'data' property
        const product = currentProduct

        if (product) {
            setFormData({
                name: product.name || '',
                category: product.category || 'COLLECTIBLE',
                priceTon: product.priceTon || 0,
                image: product.image || '',
                isListed: product.status === 'listed',
            });
        }
    }, [currentProduct]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        telegramWebApp?.HapticFeedback.impactOccurred('heavy');

        try {
            await updateProduct(productId, {
                name: formData.name,
                category: formData.category,
                priceTon: Number(formData.priceTon),
                image: formData.image,
                status: formData.isListed ? 'listed' : 'draft',
            });

            telegramWebApp?.HapticFeedback.notificationOccurred('success');
        } catch (error) {
            telegramWebApp?.HapticFeedback.notificationOccurred('error');
            console.error(error);
        }
    };

    if (loading && !formData.name) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="font-mono text-blue-500 animate-pulse tracking-[0.3em]">SYNCHRONIZING_METADATA...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white relative p-6 pb-32 overflow-hidden">
            <Background />
            <PageHeader title="UPDATE_MANIFEST" />

            <div className="relative z-10 pt-20 max-w-2xl mx-auto">
                {/* PREVIEW CARD - Same style as Add Product */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 rounded-3xl overflow-hidden border border-white/10 bg-linear-to-b from-zinc-900 to-black shadow-2xl"
                >
                    <div className="aspect-square w-full relative bg-zinc-900 flex items-center justify-center">
                        {formData.image ? (
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-zinc-700 flex flex-col items-center gap-2">
                                <Sparkles size={48} className="animate-pulse" />
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-black/40 p-4 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-blue-400 font-bold mb-1 tracking-widest uppercase">{formData.category}</p>
                            <h3 className="text-xl font-black italic tracking-tighter uppercase">{formData.name || "IDENTITY_UNKNOWN"}</h3>
                        </div>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <TextInput
                        label="METADATA_IMAGE_URL"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                    />

                    <TextInput
                        label="ASSET_NAME"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />



                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput
                            label="PRICE (TON)"
                            name="priceTon"
                            value={formData.priceTon}
                            onChange={handleChange}
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
                                <p className="text-[9px] text-zinc-500">TOGGLE MARKETPLACE LISTING</p>
                            </div>
                        </div>
                        <ToggleSwitch
                            label='LISTED'
                            name="isListed"
                            checked={formData.isListed}
                            onChange={(val) => setFormData(p => ({ ...p, isListed: val }))}
                        />
                    </div>

                    <div className="flex gap-4">
                        <PrimaryButton
                            label="Back"
                            icon={Undo2}
                            type="button"
                            onClick={() => window.history.back()}
                            className="bg-zinc-800!"
                        />
                        <PrimaryButton
                            label="SAVE_CHANGES"
                            icon={Save}
                            type="submit"
                            isLoading={loading}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductForm;