import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
