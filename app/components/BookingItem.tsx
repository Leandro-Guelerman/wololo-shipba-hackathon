'use client'
import React, { useState } from 'react';

interface BookingItemProps {
    title: string;
    hasButton?: boolean;
    buttonText?: string;
    bookingUrl?: string;
    onBooked: () => void;
}

export const BookingItem: React.FC<BookingItemProps> = ({
    title,
    hasButton = true,
    buttonText = 'Reservar',
    bookingUrl,
    onBooked
}) => {
    const [isBooked, setIsBooked] = useState(false);

    const handleClick = () => {
        if (bookingUrl) {
            window.open(bookingUrl, '_blank');
        }
        onBooked();
        setIsBooked(true);
    };

    return (
        <>
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 relative rounded-lg p-2 ${isBooked ? 'bg-green-100' : ''}`}>
                <div className="flex items-center flex-1">
                    <span className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors 
                        ${isBooked 
                            ? `bg-green-200 text-green-700` 
                            : `border-1 rounded-md border-gray-300`}`}
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
                    <span className="text-sm sm:text-base ml-3 text-gray-800">{title}</span>

                </div>
                {hasButton && !isBooked && (
                    <button
                        onClick={handleClick}
                        disabled={isBooked}
                        className={`w-full sm:w-auto px-4 py-2 text-sm font-medium cursor-pointer
                            ${isBooked 
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                                : `text-blue-600 bg-blue-50 hover:bg-blue-100 hover:shadow-md active:scale-95`
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
        </>
    );
};
