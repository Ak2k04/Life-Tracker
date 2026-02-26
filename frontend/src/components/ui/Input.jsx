import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({ label, error, className, ...props }, ref) => {
    return (
        <div className={twMerge("w-full", className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={twMerge(
                    "appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors",
                    error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600"
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
