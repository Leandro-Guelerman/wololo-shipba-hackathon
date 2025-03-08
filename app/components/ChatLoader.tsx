'use client'
import React from 'react';

export const ChatLoader: React.FC = () => {
    return (
        <div className="flex items-center space-x-2 p-4 max-w-[200px] bg-gray-100 rounded-2xl rounded-bl-none">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}; 