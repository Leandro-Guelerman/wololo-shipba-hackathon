'use client'
import React from 'react';

interface FlightCardProps {
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    airline: string;
    stops: number;
    airlineLogo?: string;
    onSelect: () => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({
                                                          origin,
                                                          destination,
                                                          departureTime,
                                                          arrivalTime,
                                                          duration,
                                                          price,
                                                          airline,
                                                          stops,
                                                          airlineLogo,
                                                          onSelect
                                                      }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-all duration-200">
            <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Información del vuelo */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Logo de la aerolínea */}
                        <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                            {airlineLogo ? (
                                <img src={airlineLogo} alt={airline} className="w-8 h-8 object-contain" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 18l14-7L5 4v14zm0-2l14-7L5 6v10z" />
                                </svg>
                            )}
                        </div>

                        {/* Detalles del vuelo */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-8">
                            {/* Horarios */}
                            <div className="flex items-center gap-3">
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-gray-900">{departureTime}</p>
                                    <p className="text-sm text-gray-500">{origin}</p>
                                </div>
                                <div className="flex flex-col items-center px-3">
                                    <div className="w-24 md:w-32 h-[2px] bg-gray-300 relative">
                                        <div className="absolute -top-[5px] -right-1 w-2 h-2 rounded-full bg-gray-300" />
                                        <div className="absolute -top-[5px] -left-1 w-2 h-2 rounded-full bg-gray-300" />
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">{duration}</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-gray-900">{arrivalTime}</p>
                                    <p className="text-sm text-gray-500">{destination}</p>
                                </div>
                            </div>

                            {/* Información adicional */}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{airline}</span>
                                <span>•</span>
                                <span>{stops === 0 ? 'Directo' : `${stops} ${stops === 1 ? 'escala' : 'escalas'}`}</span>
                            </div>
                        </div>
                    </div>

                    {/* Precio y botón */}
                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                                ${price.toLocaleString('es-ES')}
                            </p>
                            <p className="text-sm text-gray-500">por persona</p>
                        </div>
                        <button
                            onClick={onSelect}
                            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Seleccionar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};