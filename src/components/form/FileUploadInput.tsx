/* eslint-disable react-hooks/set-state-in-effect */
// components/FileUploadInput.tsx
"use client";
import React, { InputHTMLAttributes, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle } from 'lucide-react'; 

interface FileUploadInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
    onFileChange: (file: File | null) => void;
    errorMessage?: string;
    currentFile?: File | string | null; // Can be a File object or a URL string
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({ label, onFileChange, errorMessage, currentFile, ...props }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const hasError = !!errorMessage;

    useEffect(() => {
        // Clear previous object URL if any
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]); // Cleanup effect for object URLs

    useEffect(() => {
        if (currentFile instanceof File) {
            setFileName(currentFile.name);
            setPreviewUrl(URL.createObjectURL(currentFile)); // Create object URL for File
        } else if (typeof currentFile === 'string' && currentFile) {
            setFileName(currentFile.split('/').pop() || 'Existing File');
            setPreviewUrl(currentFile); // Use URL directly for string
        } else {
            setFileName(null);
            setPreviewUrl(null);
        }
    }, [currentFile]); // Depend on currentFile to update when the prop changes


    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setFileName(file.name);
            setPreviewUrl(URL.createObjectURL(file)); // Create object URL for new File
            onFileChange(file);
        } else {
            setFileName(null);
            setPreviewUrl(null);
            onFileChange(null);
        }
    };

    const handleClearFile = (e: React.MouseEvent) => {
        e.stopPropagation(); // Crucial: Prevent the div's onClick from firing
        e.preventDefault(); // Prevent default button behavior if this was a button

        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the input value so same file can be selected again
        }
        setFileName(null);
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl); // Revoke object URL on clear
        }
        setPreviewUrl(null);
        onFileChange(null);
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative group"
        >
            <label className={`absolute left-3 transition-all duration-200 z-10 pointer-events-none
                               ${fileName || previewUrl ? '-top-2 text-xs font-bold px-1 bg-[#1a1a2e] text-primary' : 'top-1/2 -translate-y-1/2 text-sm text-zinc-500'}
                               ${hasError ? 'text-rose-500!' : ''}`}
            >
                {label}
            </label>
            {/* The main clickable area is now a DIV, not a button */}
            <div
                onClick={() => fileInputRef.current?.click()} // This div triggers the file input
                className={`relative flex items-center w-full bg-[#1a1a2e]/70 rounded-xl border-2 pr-4 pl-10 py-3 text-sm transition-all duration-200 min-h-[56px] cursor-pointer
                            ${hasError ? 'border-rose-600 shadow-lg shadow-rose-900/30' :
                        'border-white/10 group-hover:border-white/20'}`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden" // Keep the actual input hidden
                    {...props}
                />
                <span className="text-white font-mono tracking-wide grow text-left overflow-hidden whitespace-nowrap text-ellipsis mr-8">
                    {fileName || ""}
                </span>

                <AnimatePresence mode="wait">
                    {previewUrl ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2"
                        >
                            <img src={previewUrl} alt="Preview" className="w-8 h-8 object-contain rounded mr-2" />
                            {/* This is now a valid nested button */}
                            <motion.button
                                type="button" // Explicitly declare type for accessibility
                                whileTap={{ scale: 0.8 }}
                                onClick={handleClearFile}
                                className="text-zinc-500 hover:text-rose-500 transition-colors"
                                title="Clear file"
                            >
                                <X size={16} />
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload-icon"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Upload size={18} className="text-zinc-500" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div> {/* End of the main clickable div */}
            <AnimatePresence>
                {hasError && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -bottom-5 left-2 text-rose-500 text-[10px] font-bold flex items-center gap-1"
                    >
                        <AlertCircle size={12} /> {errorMessage}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FileUploadInput;