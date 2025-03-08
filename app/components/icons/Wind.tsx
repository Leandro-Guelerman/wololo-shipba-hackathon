import React from 'react';

interface WindIconProps {
    isHigh?: boolean;
    className?: string;
}

export const WindIcon: React.FC<WindIconProps> = ({ isHigh = false, className = "w-5 h-5" }) => {
    return (
        <div className={`${className} ${isHigh ? 'text-amber-500' : 'text-gray-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2}
                    d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"
                />
            </svg>
        </div>
    );
}; 