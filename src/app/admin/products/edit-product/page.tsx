/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Undo2, Sparkles, Globe, Link as LinkIcon } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import TextInput from '@/components/form/TextInput';
import SelectInput from '@/components/form/SelectInput';
import NumberInput from '@/components/form/NumberInput';
import ToggleSwitch from '@/components/form/ToggleSwitch';
import PrimaryButton from '@/components/form/PrimaryButton';
import Background from '@/components/Background';
import { useProductStore } from '@/app/store/useProductStore';

const NFT_CATEGORIES = [
    { value: 'COLLECTIBLE', label: 'COLLECTIBLE' },
    { value: 'ART', label: 'ART' },
    { value: 'UTILITY', label: 'UTILITY' },
    { value: 'GAMING', label: 'GAMING' },
];

interface EditProductFormProps {
    productId: string; // Pass the ID instead of the whole object
    onGoBack: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ productId, onGoBack }) => {
    const { currentProduct, fetchProductById, updateProduct, loading } = useProductStore();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        priceTon: 0,
        royalty: 0,
        image: '',
        mintDate: '',
        isListed: false,
        contractAddress: '',
    });

    const [telegramWebApp, setTelegramWebApp] = useState<any>(null);

    // 1. Load the single product into the store on mount
    useEffect(() => {
        if (productId) fetchProductById(productId);
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            setTelegramWebApp(window.Telegram.WebApp);
        }
    }, [productId]);

    // 2. Sync local form state when store product is loaded
    useEffect(() => {
        if (currentProduct) {
            setFormData({
                name: currentProduct.name,
                description: currentProduct.description,
                category: currentProduct.category,
                priceTon: currentProduct.priceTon,
                royalty: currentProduct.royalty,
                image: currentProduct.image,
                mintDate: currentProduct.mintDate,
                isListed: currentProduct.status === 'listed',
                contractAddress: currentProduct.contractAddress,
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
                ...formData,
                status: formData.isListed ? 'listed' : 'draft',
            });

            telegramWebApp?.HapticFeedback.notificationOccurred('success');
            onGoBack(); // Navigate back on success
        } catch (error) {
            telegramWebApp?.HapticFeedback.notificationOccurred('error');
            alert("UPDATE_FAILED");
        }
    };

    if (loading && !currentProduct) return <div className="p-20 text-center font-mono animate-pulse">LOADING_ENCRYPTED_DATA...</div>;

    return (
        <div className="min-h-screen bg-black text-white relative p-6 pb-24 overflow-hidden">
            <Background />
            <PageHeader title="UPDATE_METADATA" />

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 pt-24 space-y-6 max-w-xl mx-auto"
            >
                {/* Visual Preview Section */}
                <div className="flex gap-4 items-center p-4 bg-zinc-900/50 border border-white/10 rounded-2xl">
                    <img src={formData.image} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-white/20" />
                    <div>
                        <h4 className="text-[10px] font-black text-blue-500 tracking-widest">CURRENT_ASSET</h4>
                        <p className="text-sm font-bold italic uppercase">{formData.name || 'UNNAMED_NFT'}</p>
                    </div>
                </div>

                <TextInput
                    label="ASSET_NAME"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <TextInput
                    label="IMAGE_LINK (IPFS/URL)"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://..."
                />

                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="PRICE (TON)"
                        name="priceTon"
                        value={formData.priceTon}
                        onChange={handleChange}
                    />
                    <SelectInput
                        label="CATEGORY"
                        name="category"
                        options={NFT_CATEGORIES}
                        value={formData.category}
                        onChange={handleChange}
                    />
                </div>

                <TextInput
                    label="CONTRACT_ADDRESS"
                    name="contractAddress"
                    value={formData.contractAddress}
                    onChange={handleChange}
                />

                <div className="bg-[#1a1a2e]/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold">MARKETPLACE_STATUS</span>
                    <ToggleSwitch
                        label="LISTED"
                        name="isListed"
                        checked={formData.isListed}
                        onChange={(val) => setFormData(p => ({ ...p, isListed: val }))}
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <PrimaryButton
                        label="ABORT"
                        icon={Undo2}
                        type="button"
                        onClick={onGoBack}
                        className="!bg-zinc-800"
                    />
                    <PrimaryButton
                        label="SAVE_CHANGES"
                        icon={Save}
                        type="submit"
                        isLoading={loading}
                    />
                </div>
            </motion.form>
        </div>
    );
};

export default EditProductForm;