'use client'
import React from 'react';
import { BookingItem } from './BookingItem';
import { WeatherInfo } from './WeatherInfo';

interface ChatMessageProps {
    message: string | {
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
    isNew?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    isNew = false
}) => {
    if (typeof message === 'string') {
        return (
            <div className={`flex justify-start mb-4 ${
                isNew ? 'animate-message-appear' : ''
            }`}>
                <div className="w-full p-3 bg-white shadow-sm rounded-2xl border border-gray-100">
                    <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed text-gray-800">
                        {message}
                    </p>
                </div>
            </div>
        );
    }

    // Renderizado para mensaje con ítems o clima
    return (
        <div className={`flex justify-start mb-4 ${
            isNew ? 'animate-message-appear' : ''
        }`}>
            <div className="w-full p-4 bg-white shadow-sm rounded-2xl border border-gray-100">
                {message.type === 'itemized' && message.mainItems && (
                    <>
                        {/* Ítems principales */}
                        <div className="space-y-4">
                            {message.mainItems.map((item, index) => (
                                <BookingItem
                                    key={index}
                                    {...item}
                                    type="main"
                                    showDivider={index === 0}
                                />
                            ))}
                        </div>

                        {/* Separador entre principales y actividades */}
                        {message.activities && message.activities.length > 0 && (
                            <div className="my-4 border-t border-gray-100" />
                        )}

                        {/* Actividades */}
                        {message.activities && (
                            <div className="space-y-4">
                                <p className="text-sm font-medium text-gray-500 mb-3">Actividades sugeridas:</p>
                                {message.activities.map((activity, index) => (
                                    <BookingItem
                                        key={index}
                                        {...activity}
                                        type="activity"
                                        hasButton={true}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {message.type === 'weather' && message.weather && (
                    <WeatherInfo
                        provided_dates={message.weather.provided_dates}
                        recommended_dates={message.weather.recommended_dates}
                    />
                )}
            </div>
        </div>
    );
}; 