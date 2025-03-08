import React from 'react';

interface TemperatureIconProps {
    type: 'high' | 'low' | 'normal';
    className?: string;
}

export const TemperatureIcon: React.FC<TemperatureIconProps> = ({ type, className = "w-5 h-5" }) => {
    const color = type === 'high' 
        ? 'text-red-500' 
        : type === 'low' 
            ? 'text-blue-500' 
            : 'text-gray-500';

    return (
        <div className={`${className} ${color}`}>
            {type === 'high' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a2 2 0 0 1 2 2v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 2-2zm0 2a.5.5 0 0 0-.5.5v10.5a.5.5 0 0 0 1 0V4.5A.5.5 0 0 0 12 4z"/>
                    <path d="M8.5 14.5A3.5 3.5 0 0 0 12 18a3.5 3.5 0 0 0 3.5-3.5h-7z"/>
                </svg>
            ) : type === 'low' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a2 2 0 0 0-2 2v10.5a4 4 0 1 0 4 0V4a2 2 0 0 0-2-2zm0 2a.5.5 0 0 1 .5.5v10.5a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 12 4z"/>
                    <path d="M15.5 14.5A3.5 3.5 0 0 1 12 18a3.5 3.5 0 0 1-3.5-3.5h7z"/>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a2 2 0 0 1 2 2v8.5a4 4 0 1 1-4 0V4a2 2 0 0 1 2-2zm0 2a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V4.5A.5.5 0 0 0 12 4z"/>
                    <path d="M8.5 12.5A3.5 3.5 0 0 0 12 16a3.5 3.5 0 0 0 3.5-3.5h-7z"/>
                </svg>
            )}
        </div>
    );
}; 