import React from 'react';
import { TemperatureIcon } from './icons/Temperature';
import { RainIcon } from './icons/Rain';
import { WindIcon } from './icons/Wind';

interface WeatherHazards {
    rain_chances: 'high' | 'low' | 'normal';
    temperatures: 'high' | 'low' | 'normal';
    high_winds: boolean;
}

interface WeatherPeriod {
    departureDate: string;
    arrivalDate: string;
    average_weather: number;
    weather_hazards: WeatherHazards;
}

interface WeatherInfoProps {
    provided_dates: WeatherPeriod;
    recommended_dates: WeatherPeriod;
}

const WeatherPeriodDisplay: React.FC<{ 
    data: WeatherPeriod; 
    title: string;
    type: 'provided' | 'recommended';
}> = ({ data, title, type }) => {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const bgColor = type === 'provided' ? 'bg-orange-50' : 'bg-green-50';
    const borderColor = type === 'provided' ? 'border-orange-100' : 'border-green-100';
    const titleColor = type === 'provided' ? 'text-orange-700' : 'text-green-700';

    return (
        <div className={`p-4 ${bgColor} rounded-lg border ${borderColor}`}>
            <h3 className={`text-sm font-medium ${titleColor} mb-3`}>{title}</h3>
            
            <div className="space-y-3">
                {/* Fechas */}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                        {formatDate(data.departureDate)} - {formatDate(data.arrivalDate)}
                    </span>
                    <span className="font-medium text-gray-900">
                        {data.average_weather}°C
                    </span>
                </div>

                {/* Indicadores de clima */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <TemperatureIcon type={data.weather_hazards.temperatures} className="w-7 h-7" />
                        <span className="text-sm text-gray-600">
                            {data.weather_hazards.temperatures === 'high' ? 'Alta' : 
                             data.weather_hazards.temperatures === 'low' ? 'Baja' : 'Normal'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <RainIcon chance={data.weather_hazards.rain_chances} className="w-7 h-7" />
                        <span className="text-sm text-gray-600">
                            {data.weather_hazards.rain_chances === 'high' ? 'Alta' : 
                             data.weather_hazards.rain_chances === 'low' ? 'Baja' : 'Normal'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <WindIcon isHigh={data.weather_hazards.high_winds} className="w-7 h-7" />
                        <span className="text-sm text-gray-600">
                            {data.weather_hazards.high_winds ? 'Fuertes' : 'Suaves'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const WeatherInfo: React.FC<WeatherInfoProps> = ({ provided_dates, recommended_dates }) => {
    return (
        <div className="space-y-4">
            <WeatherPeriodDisplay 
                data={provided_dates} 
                title="Clima para las fechas seleccionadas"
                type="provided"
            />
            <WeatherPeriodDisplay 
                data={recommended_dates} 
                title="Fechas recomendadas"
                type="recommended"
            />
        </div>
    );
}; 