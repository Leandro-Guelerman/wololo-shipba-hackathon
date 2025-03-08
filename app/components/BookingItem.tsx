'use client'
import React from 'react';

interface BookingItemProps {
    title: string;
    hasButton?: boolean;
    buttonText?: string;
    bookingUrl?: string;
    isBooked?: boolean;
    type?: 'main' | 'activity';
    showDivider?: boolean;
}

export const BookingItem: React.FC<BookingItemProps> = ({
    title,
    hasButton = true,
    buttonText = 'Reservar',
    bookingUrl,
    isBooked = false,
    type = 'main',
    showDivider = false
}) => {
    const handleClick = () => {
        if (bookingUrl) {
            window.open(bookingUrl, '_blank');
        }
    };

    const colorScheme = type === 'main' 
        ? { text: 'blue', bg: 'blue' }
        : { text: 'green', bg: 'green' };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 relative">
                <div className="flex items-center justify-between flex-1">
                    <span className="text-sm sm:text-base text-gray-800">{title}</span>
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full transition-colors ml-3
                        ${isBooked 
                            ? `bg-${colorScheme.bg}-100 text-${colorScheme.text}-600` 
                            : `border-2 border-gray-200`}`}
                    >
                        {isBooked && (
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-3.5 w-3.5" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                            >
                                <path 
                                    fillRule="evenodd" 
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                    clipRule="evenodd" 
                                />
                            </svg>
                        )}
                    </span>
                </div>
                {hasButton && (
                    <button
                        onClick={handleClick}
                        disabled={isBooked}
                        className={`w-full sm:w-auto px-4 py-2 text-sm font-medium 
                            ${isBooked 
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                                : `text-${colorScheme.text}-600 bg-${colorScheme.bg}-50 hover:bg-${colorScheme.bg}-100 hover:shadow-md active:scale-95`
                            }
                            rounded-lg transition-all duration-200 flex items-center justify-center gap-2`}
                    >
                        <span>{isBooked ? 'Reservado' : buttonText}</span>
                        {!isBooked && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {showDivider && (
                <div className="my-3 border-t border-gray-100" />
            )}
        </>
    );
}; 