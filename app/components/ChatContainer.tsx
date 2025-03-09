'use client'
import {BookingContainer} from "@/app/components/BookingContainer";
import {conversationMessages} from "@/app/testData/conversationMessages";
import React from 'react';
import {ChatMessage} from './ChatMessage';
import {ChatLoader} from './ChatLoader';

export interface WeatherData {
    provided_dates?: {
        "departureDate": string,
        "arrivalDate": string,
        "average_weather": number,
        "weather_hazards": {
            rain_chances: 'high' | 'low' | 'medium';
            temperatures: 'high' | 'low' | 'medium';
            "high_winds": false
        },
    },
    recommended_dates?: {
        departureDate: string;
        arrivalDate: string;
        average_weather: number;
        weather_hazards: {
            rain_chances: 'high' | 'low' | 'medium';
            temperatures: 'high' | 'low' | 'medium';
            high_winds: boolean;
        }
    };
}

export interface HotelData {
    name: string;
    address: string;
    checkInDate: string;
    checkOutDate: string;
    price: number;
    href: string;
}

interface FlightSegment {
    "arrival_time": string;
    "departure_time": string;
    "duration": string;
    "name": string;
    "price": number;
    "stops": number;
}

export interface FlightData {
    departure: FlightSegment;
    return: FlightSegment;
}

export interface WeatherData {
    provided_dates?: {
        "departureDate": string,
        "arrivalDate": string,
        "average_weather": number,
        "weather_hazards": {
            rain_chances: 'high' | 'low' | 'medium';
            temperatures: 'high' | 'low' | 'medium';
            "high_winds": false
        },
    },
    recommended_dates?: {
        departureDate: string;
        arrivalDate: string;
        average_weather: number;
        weather_hazards: {
            rain_chances: 'high' | 'low' | 'medium';
            temperatures: 'high' | 'low' | 'medium';
            high_winds: boolean;
        }
    };
}

export interface ActivityData {
    price: number;
    duration: string;
    href: string;
    name: string;
    ratings: number;
    thumbnail_url: string;
}

export interface HotelData {
    name: string;
    address: string;
    checkInDate: string;
    checkOutDate: string;
    price: number;
}

export interface Message {
    id: string;
    text?: string;
    message?: {
        type: 'flight' | 'hotel' | 'activities' | 'weather';
        flights?: FlightData;
        hotel?: HotelData;
        activities?: ActivityData[];
        weather?: WeatherData,
    };
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
        chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    return (
        <div className="h-full w-full overflow-y-auto">
            <div className="h-full w-full max-w-3xl mx-auto px-4">
                <div className="h-full pb-32 pt-4">
                    {messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                        />
                    ))}
                    {isLoading && (
                        <div className="mt-2">
                            <ChatLoader/>
                        </div>
                    )}
                    <BookingContainer messages={conversationMessages} />

                <div ref={chatEndRef}/>
                </div>
            </div>
        </div>
    );
};
