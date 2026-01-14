"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Tag, DollarSign, Calendar, Upload, Layers, Sparkles, Link, MessageSquare
} from 'lucide-react';
import WebApp from '@twa-dev/sdk';
import PageHeader from '@/components/PageHeader';
import FileUploadInput from '@/components/form/FileUploadInput';
import TextInput from '@/components/form/TextInput';
import SelectInput from '@/components/form/SelectInput';
import NumberInput from '@/components/form/NumberInput';
import ToggleSwitch from '@/components/form/ToggleSwitch';
import PrimaryButton from '@/components/form/PrimaryButton';
import Background from '@/components/Background';

interface FormData {
    nftName: string;
    description: string;
    category: string;
    priceTon: number;
    royalty: number;
    imageUrl: File | null;
    mintDate: string;
    isListed: boolean;
    contractAddress: string;
}

const NFT_CATEGORIES = [
    { value: 'COLLECTIBLE', label: 'COLLECTIBLE' },
    { value: 'ART', label: 'ART' },
    { value: 'UTILITY', label: 'UTILITY' },
    { value: 'GAMING', label: 'GAMING' },
    { value: 'METAVERSE', label: 'METAVERSE' },
    { value: 'MUSIC', label: 'MUSIC' },
];

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const ProductForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        nftName: '',
        description: '',
        category: '',
        priceTon: 0,
        royalty: 5, // Default royalty
        imageUrl: null,
        mintDate: getTodayDate(),
        isListed: false,
        contractAddress: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing/selecting
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name as keyof FormData]: undefined }));
        }
    };

    const handleFileChange = (file: File | null) => {
        setFormData(prev => ({ ...prev, imageUrl: file }));
        if (errors.imageUrl) {
            setErrors(prev => ({ ...prev, imageUrl: undefined }));
        }
    };

    const handleToggleChange = (name: keyof FormData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };


    const validateForm = () => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        if (!formData.nftName.trim()) newErrors.nftName = 'NFT Name is required.';
        if (formData.nftName.trim().length < 3) newErrors.nftName = 'Name must be at least 3 characters.';
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
        console.log("Submitting NFT Data:", formData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
        WebApp.HapticFeedback.notificationOccurred('success');
        alert("NFT Successfully Deployed to Network!");
        // Reset form or navigate away
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
        <div className="min-h-screen bg-linear-to-br from-[#000000] to-[#0a101f] text-white font-sans relative p-6 pb-24 overflow-hidden">
            <Background />
            <PageHeader title="DEPLOY_NFT" />
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
                        name="nftName"
                        value={formData.nftName}
                        onChange={handleChange}
                        placeholder="e.g., QUANTUM_REALM_KEY"
                        errorMessage={errors.nftName}
                    />
                </motion.div>

                {/* Description - Using TextInput but can be a custom TextArea if needed */}
                <motion.div variants={fieldVariants}>
                    <TextInput
                        label="DESCRIPTION"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detailed description of the NFT"
                        maxLength={250} // Example
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
                        icon={DollarSign}
                        value={formData.priceTon === 0 ? '' : formData.priceTon} // Show empty if 0 for better UX
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
                        icon={Tag}
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
                        max={getTodayDate()} // Cannot select future date
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
                        label="LIST_NFT_IMMEDIATELY"
                        name="isListed"
                        checked={formData.isListed}
                        onChange={(checked) => handleToggleChange('isListed', checked)}
                    />
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={fieldVariants} className="pt-4"> {/* Added padding top for separation */}
                    <PrimaryButton
                        label="DEPLOY_NFT_TO_NETWORK"
                        icon={Upload}
                        type="submit"
                        isLoading={isLoading}
                        disabled={isLoading}
                    />
                </motion.div>
            </motion.form>
        </div>
    );
};

export default ProductForm;