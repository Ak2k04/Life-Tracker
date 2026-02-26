import React from 'react';
import { twMerge } from 'tailwind-merge';
import Spinner from './Spinner';

const Button = ({ children, variant = 'primary', isLoading, className, disabled, ...props }) => {
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";

    const variants = {
        primary: "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
        secondary: "text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-900 focus:ring-indigo-500",
        outline: "text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-indigo-500",
        danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], (disabled || isLoading) && "opacity-70 cursor-not-allowed", className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Spinner className="w-4 h-4 mr-2" />}
            {children}
        </button>
    );
};

export default Button;
