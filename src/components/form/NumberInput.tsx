"use client";
import React from 'react';
import TextInput from './TextInput';
import { InputHTMLAttributes } from 'react';

interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    errorMessage?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, errorMessage, ...props }) => {
    return (
        <TextInput
            type="number"
            inputMode="decimal" 
            pattern="[0-9]*[.,]?[0-9]*" 
            label={label}
            errorMessage={errorMessage}
            {...props}
        />
    );
};

export default NumberInput;