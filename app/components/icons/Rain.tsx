import React from 'react';

interface RainIconProps {
    chance: 'high' | 'low' | 'normal';
    className?: string;
}

export const RainIcon: React.FC<RainIconProps> = ({ chance, className = "w-5 h-5" }) => {
    const color = chance === 'high' 
        ? 'text-blue-600' 
        : chance === 'low' 
            ? 'text-blue-300' 
            : 'text-blue-400';

    return (
        <div className={`${className} ${color}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 10a6 6 0 0 1 11.86-1.1A4.5 4.5 0 0 1 20 13.5c0 2.49-2.01 4.5-4.5 4.5h-11A4 4 0 0 1 4.5 10zm8.5 3v5m-4-3v5m8-3v5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>
        </div>
    );
}; 