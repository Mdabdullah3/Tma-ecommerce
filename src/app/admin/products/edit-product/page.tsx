/* eslint-disable react-hooks/set-state-in-effect */
// components/EditProductForm.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image, Tag, DollarSign, Calendar, Upload, Layers, List, Eye, Sparkles, Plus, CheckCircle,
    FileText, Link, Shield, MessageSquare, Save, Undo2,
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import PageHeader from '@/components/PageHeader';
import FileUploadInput from '@/components/form/FileUploadInput';
import TextInput from '@/components/form/TextInput';
import SelectInput from '@/components/form/SelectInput';
import NumberInput from '@/components/form/NumberInput';
import ToggleSwitch from '@/components/form/ToggleSwitch';
import PrimaryButton from '@/components/form/PrimaryButton';

// Assuming this interface is also defined in ProductManager or a shared types file
interface NFTProduct {
    id: string;
    name: string;
    description: string; // Added description for edit form
    image: string; // URL to the NFT image (will be the initial currentFile for FileUploadInput)
    category: string;
    priceTon: number;
    royalty: number; // Added royalty for edit form
    status: 'listed' | 'draft' | 'sold';
    views: number;
    mintDate: string;
    isListed?: boolean | undefined; // For form toggle
    contractAddress: string; // Added contract address for edit form
}

// Dummy initial data for an NFT being edited
const dummyInitialProduct: NFTProduct = {
    id: 'nft002',
    name: 'AETHERIAL BLOSSOM V2.0',
    description: 'A vibrant, generative art piece capturing the essence of digital flora. Each bloom is unique, minted on the TON blockchain.',
    image: 'https://cdn-icons-png.flaticon.com/512/3655/3655113.png',
    category: 'ART',
    priceTon: 8.2,
    royalty: 7,
    status: 'listed',
    views: 890,
    mintDate: '2023-11-01',
    contractAddress: '0:e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z',
};

const NFT_CATEGORIES = [
    { value: 'COLLECTIBLE', label: 'COLLECTIBLE' },
    { value: 'ART', label: 'ART' },
    { value: 'UTILITY', label: 'UTILITY' },
    { value: 'GAMING', label: 'GAMING' },
    { value: 'METAVERSE', label: 'METAVERSE' },
    { value: 'MUSIC', label: 'MUSIC' },
];

interface EditProductFormProps {
    initialProduct?: NFTProduct;
    onGoBack?: () => void; // Optional callback to go back to product list
    onProductUpdated?: (updatedProduct: NFTProduct) => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ initialProduct = dummyInitialProduct, onGoBack, onProductUpdated }) => {
    const [formData, setFormData] = useState<Omit<NFTProduct, 'id' | 'views'> & { imageUrl: File | string | null }>({
        ...initialProduct,
        name: initialProduct.name,
        description: initialProduct.description,
        category: initialProduct.category,
        priceTon: initialProduct.priceTon,
        royalty: initialProduct.royalty,
        imageUrl: initialProduct.image, // Initialize with existing image URL
        mintDate: initialProduct.mintDate,
        isListed: initialProduct.status === 'listed', // Convert status to boolean
        contractAddress: initialProduct.contractAddress,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);

    // This useEffect ensures the form updates if initialProduct changes (e.g., if navigating to edit different product)
    useEffect(() => {
        setFormData({
            ...formData,
            name: initialProduct.name,
            description: initialProduct.description,
            category: initialProduct.category,
            priceTon: initialProduct.priceTon,
            royalty: initialProduct.royalty,
            imageUrl: initialProduct.image,
            mintDate: initialProduct.mintDate,
            isListed: initialProduct.status === 'listed',
            contractAddress: initialProduct.contractAddress,
        });
        setErrors({}); // Clear errors on product change
    }, [initialProduct]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof formData]) {
            setErrors(prev => ({ ...prev, [name as keyof typeof formData]: undefined }));
        }
    };

    const handleFileChange = (file: File | null) => {
        setFormData(prev => ({ ...prev, imageUrl: file }));
        if (errors.imageUrl) {
            setErrors(prev => ({ ...prev, imageUrl: undefined }));
        }
    };

    const handleToggleChange = (name: keyof typeof formData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const validateForm = () => {
        const newErrors: Partial<Record<keyof typeof formData, string>> = {};
        if (!formData.name.trim()) newErrors.name = 'NFT Name is required.';
        if (formData.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters.';
        if (!formData.description.trim()) newErrors.description = 'Description is required.';
        if (!formData.category) newErrors.category = 'Category is required.';
        if (formData.priceTon <= 0) newErrors.priceTon = 'Price must be greater than 0.';
        if (!formData.imageUrl) newErrors.imageUrl = 'NFT Image is required.';
        if (!formData.contractAddress.trim()) newErrors.contractAddress = 'Contract Address is required.';
        if (formData.contractAddress.trim().length < 10) newErrors.contractAddress = 'Invalid Contract Address.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        WebApp.HapticFeedback.impactOccurred('heavy');

        if (!validateForm()) {
            WebApp.HapticFeedback.notificationOccurred('error');
            return;
        }

        setIsLoading(true);
        console.log("Updating NFT Data:", formData);

        // Simulate API call to update product
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
        WebApp.HapticFeedback.notificationOccurred('success');
        alert("NFT Record Successfully Updated!");

        // Construct the updated product object for callback
        const updatedProduct: NFTProduct = {
            ...initialProduct, // Keep original id and views
            name: formData.name,
            description: formData.description,
            image: typeof formData.imageUrl === 'string' ? formData.imageUrl : 'UPLOADED_NEW_IMAGE_URL_HERE', // Simplified for demo
            category: formData.category,
            priceTon: formData.priceTon,
            royalty: formData.royalty,
            mintDate: formData.mintDate,
            status: formData.isListed ? 'listed' : 'draft', // Convert boolean back to status
            contractAddress: formData.contractAddress,
        };
        onProductUpdated?.(updatedProduct); // Notify parent of update
        onGoBack?.(); // Go back to list after update
    };

    const formVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.07,
                delayChildren: 0.1
            }
        }
    };

    const fieldVariants = {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#000000] to-[#0a101f] text-white font-sans relative p-6 pb-24 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 bg-radial-gradient animate-pulse-bg" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.02] transform-gpu animate-pan-grid" />
                <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob" style={{ animationDelay: '0s' }} />
                <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob" style={{ animationDelay: '-4s' }} />
            </div>
            <div className="absolute inset-0 z-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

            <PageHeader title={`EDIT_NFT_RECORD`} />

            <motion.form
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
                variants={formVariants}
                className="relative z-10 pt-28 space-y-7"
            >
                {/* NFT Image Upload */}
                <motion.div variants={fieldVariants}>
                    <FileUploadInput
                        label="NFT_IMAGE_FILE"
                        name="imageUrl"
                        accept="image/*"
                        onFileChange={handleFileChange}
                        currentFile={formData.imageUrl}
                        errorMessage={errors.imageUrl}
                    />
                </motion.div>

                {/* NFT Name */}
                <motion.div variants={fieldVariants}>
                    <TextInput
                        label="NFT_NAME"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., QUANTUM_REALM_KEY"
                        errorMessage={errors.name}
                    />
                </motion.div>

                {/* Description */}
                <motion.div variants={fieldVariants}>
                    <TextInput // Consider a custom TextArea for longer descriptions if needed
                        label="DESCRIPTION"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detailed description of the NFT"
                        maxLength={250}
                        errorMessage={errors.description}
                    />
                </motion.div>

                {/* Category Select */}
                <motion.div variants={fieldVariants}>
                    <SelectInput
                        label="CATEGORY"
                        name="category"
                        options={NFT_CATEGORIES}
                        value={formData.category}
                        onChange={handleChange}
                        errorMessage={errors.category}
                    />
                </motion.div>

                {/* Price (TON) */}
                <motion.div variants={fieldVariants}>
                    <NumberInput
                        label="PRICE (TON)"
                        name="priceTon"
                        value={formData.priceTon === 0 ? '' : formData.priceTon}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        placeholder="0.0 TON"
                        errorMessage={errors.priceTon}
                    />
                </motion.div>

                {/* Royalty Percentage */}
                <motion.div variants={fieldVariants}>
                    <NumberInput
                        label="ROYALTY (%)"
                        name="royalty"
                        value={formData.royalty}
                        onChange={handleChange}
                        step="1"
                        min="0"
                        max="20"
                        placeholder="5%"
                        errorMessage={errors.royalty}
                    />
                </motion.div>

                {/* Mint Date */}
                <motion.div variants={fieldVariants}>
                    <TextInput
                        label="MINT_DATE"
                        name="mintDate"
                        type="date"
                        value={formData.mintDate}
                        onChange={handleChange}
                        errorMessage={errors.mintDate}
                        max={new Date().toISOString().split('T')[0]} // Max date is today
                    />
                </motion.div>

                {/* Contract Address */}
                <motion.div variants={fieldVariants}>
                    <TextInput
                        label="CONTRACT_ADDRESS"
                        name="contractAddress"
                        value={formData.contractAddress}
                        onChange={handleChange}
                        placeholder="0:a1b2c3d4e5f6..."
                        errorMessage={errors.contractAddress}
                    />
                </motion.div>

                {/* Is Listed Toggle */}
                <motion.div variants={fieldVariants}>
                    <ToggleSwitch
                        label="CURRENTLY_LISTED_ON_MARKET"
                        name="isListed"
                        checked={formData.isListed}
                        onChange={(checked) => handleToggleChange('isListed', checked)}
                    />
                </motion.div>

                {/* Action Buttons */}
                <motion.div variants={fieldVariants} className="pt-4 flex gap-3">
                    <PrimaryButton
                        label="CANCEL_EDIT"
                        icon={Undo2}
                        type="button"
                        onClick={onGoBack} // Go back without saving
                        className="!bg-zinc-700 !shadow-zinc-900/40 hover:!bg-zinc-600 active:!bg-zinc-800"
                    />
                    <PrimaryButton
                        label="UPDATE_NFT_RECORD"
                        icon={Save}
                        type="submit"
                        isLoading={isLoading}
                        disabled={isLoading}
                    />
                </motion.div>
            </motion.form>
        </div>
    );
};

export default EditProductForm;