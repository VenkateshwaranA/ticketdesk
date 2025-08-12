
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-16 w-16',
    };

    return (
        <div className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 dark:border-gray-600 border-t-indigo-600 ${sizeClasses[size]}`}></div>
    );
};

export default Spinner;
