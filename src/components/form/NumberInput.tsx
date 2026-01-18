"use client";
import React from 'react';
import TextInput from './TextInput';
import { InputHTMLAttributes } from 'react';
import { Hash } from 'lucide-react';

interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    errorMessage?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, errorMessage, ...props }) => {
    return (
        <TextInput
            type="number"
            inputMode="decimal"
            label={label}
            icon={Hash}
            errorMessage={errorMessage}
            {...props}
        />
    );
};

export default NumberInput;