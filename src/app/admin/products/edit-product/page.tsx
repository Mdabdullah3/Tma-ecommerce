/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save, Undo2,
} from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import FileUploadInput from '@/components/form/FileUploadInput';
import TextInput from '@/components/form/TextInput';
import SelectInput from '@/components/form/SelectInput';
import NumberInput from '@/components/form/NumberInput';
import ToggleSwitch from '@/components/form/ToggleSwitch';
import PrimaryButton from '@/components/form/PrimaryButton';
import Background from '@/components/Background';

interface NFTProduct {
    id: string;
    name: string;
    description: string;
    image: string; // URL to the NFT image
    category: string;
    priceTon: number;
    royalty: number;
    status: 'listed' | 'draft' | 'sold';
    views: number;
    mintDate: string;
    isListed?: boolean; // For form toggle
    contractAddress: string;
}

// Dummy initial data for an NFT being edited
const dummyInitialProduct: NFTProduct = {
    id: 'nft002',
    name: 'AETHERIAL BLOSSOM V2.0',
    description: 'A vibrant, generative art piece capturing the essence of digital flora. Each bloom is unique, minted on the TON blockchain.',
    image: 'https://cdn-icons-png.flaticon.com/512/3655/3655113.png', // Example image URL
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
    onGoBack?: () => void;
    onProductUpdated?: (updatedProduct: NFTProduct) => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ initialProduct = dummyInitialProduct, onGoBack, onProductUpdated }) => {
    // State to manage form data, including a new `imageUrl` which can be File or string
    const [formData, setFormData] = useState<Omit<NFTProduct, 'id' | 'views' | 'image' | 'status'> & { imageUrl: File | string | null; isListed: boolean }>(() => ({
        // Initialize state directly from initialProduct
        name: initialProduct.name,
        description: initialProduct.description,
        category: initialProduct.category,
        priceTon: initialProduct.priceTon,
        royalty: initialProduct.royalty,
        imageUrl: initialProduct.image, // URL or File
        mintDate: initialProduct.mintDate,
        isListed: initialProduct.status === 'listed', // Convert status to boolean for toggle
        contractAddress: initialProduct.contractAddress,
    }));

    const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [telegramWebApp, setTelegramWebApp] = useState<any>(null); // State to hold the WebApp instance

    // Effect to dynamically load Telegram WebApp SDK
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
            setTelegramWebApp(window.Telegram.WebApp);
        }
    }, []);

    // Effect to reset form data when `initialProduct` prop changes
    // This is crucial for editing different products without stale data
    useEffect(() => {
        // Only update if initialProduct.id is different, or if it's the first load
        if (initialProduct) {
            setFormData({
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
            setErrors({}); // Clear errors when a new product is loaded
        }
    }, [initialProduct.id]); // Depend only on initialProduct.id for re-initialization


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement; // Type assertion
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing/selecting
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
        if (telegramWebApp) { // Use conditionally
            telegramWebApp.HapticFeedback.impactOccurred('heavy');
        }

        if (!validateForm()) {
            if (telegramWebApp) { // Use conditionally
                telegramWebApp.HapticFeedback.notificationOccurred('error');
            }
            return;
        }

        setIsLoading(true);
        console.log("Updating NFT Data:", formData);
        let uploadedImageUrl = formData.imageUrl;
        if (formData.imageUrl instanceof File) {
            console.log("Uploading new image file...");           
            uploadedImageUrl = 'https://example.com/new_uploaded_image.png'; // Placeholder for demo
        }

        try {
            // const apiResponse = await fetch('/api/nfts/${initialProduct.id}', {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         ...formData,
            //         image: uploadedImageUrl,
            //         status: formData.isListed ? 'listed' : 'draft',
            //     }),
            // });
            // if (!apiResponse.ok) {
            //     throw new Error('Failed to update NFT.');
            // }
            // const result = await apiResponse.json();
            // console.log('API Response:', result);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500)); // Shorter for better UX

            if (telegramWebApp) { // Use conditionally
                telegramWebApp.HapticFeedback.notificationOccurred('success');
            }
            alert("NFT Record Successfully Updated!");

            // Construct the updated product object for callback
            const updatedProduct: NFTProduct = {
                ...initialProduct, // Keep original id and views
                name: formData.name,
                description: formData.description,
                image: uploadedImageUrl as string, // Ensure it's a string URL here
                category: formData.category,
                priceTon: formData.priceTon,
                royalty: formData.royalty,
                mintDate: formData.mintDate,
                status: formData.isListed ? 'listed' : 'draft', // Convert boolean back to status
                contractAddress: formData.contractAddress,
            };
            onProductUpdated?.(updatedProduct); // Notify parent of update
            onGoBack?.(); // Go back to list after update

        } catch (error) {
            console.error("Error updating NFT:", error);
            if (telegramWebApp) { // Use conditionally
                telegramWebApp.HapticFeedback.notificationOccurred('error');
            }
            alert("Failed to update NFT. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
           
            <Background />
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
                    <TextInput
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
                        onClick={onGoBack}
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