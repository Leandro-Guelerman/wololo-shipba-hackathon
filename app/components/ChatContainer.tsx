'use client'
import React from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatLoader } from './ChatLoader';

export interface Message {
    id: string;
    text?: string;
    message?: {
        type: 'itemized' | 'weather';
        mainItems?: {
            title: string;
            hasButton?: boolean;
            buttonText?: string;
            bookingUrl?: string;
            isBooked?: boolean;
        }[];
        activities?: {
            title: string;
            buttonText?: string;
            bookingUrl?: string;
            isBooked?: boolean;
        }[];
        weather?: {
            provided_dates: {
                departureDate: string;
                arrivalDate: string;
                average_weather: number;
                weather_hazards: {
                    rain_chances: 'high' | 'low' | 'normal';
                    temperatures: 'high' | 'low' | 'normal';
                    high_winds: boolean;
                }
            };
            recommended_dates: {
                departureDate: string;
                arrivalDate: string;
                average_weather: number;
                weather_hazards: {
                    rain_chances: 'high' | 'low' | 'normal';
                    temperatures: 'high' | 'low' | 'normal';
                    high_winds: boolean;
                }
            };
        };
    };
    isNew: boolean;
}

interface ChatContainerProps {
    messages: Message[];
    isLoading?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
    messages,
    isLoading = false
}) => {
    const chatEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="h-full w-full max-w-3xl mx-auto px-4">
            <div className="h-full overflow-y-auto pb-32 pt-4">
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        message={message.message || message.text || ''}
                        isNew={message.isNew}
                    />
                ))}
                {isLoading && (
                    <div className="mt-2">
                        <ChatLoader />
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
        </div>
    );
}; 