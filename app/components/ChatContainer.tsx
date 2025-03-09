'use client'
import React from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatLoader } from './ChatLoader';

export interface Message {
    id: string;
    text?: string;
    message?: {
        type: 'flight' | 'hotel' | 'activities' | 'recommended_dates';
        flights?: {
            segments: [{
                departure: {
                    cityName: string;
                    airport: string;
                    date: string;
                };
                arrival: {
                    cityName: string;
                    airport: string;
                    date: string;
                };
                duration: string;
                numberOfStops: number;
            }]
            price: number;
        };
        hotel?: {
            name: string;
            address: string;
            checkInDate: string;
            checkOutDate: string;
            price: number;
        };
        activities?: {
            title: string;
            description: string;
            bookingUrl?: string;
            price: number;
        }[];
        recommended_dates?: {
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
                        message={message}
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
