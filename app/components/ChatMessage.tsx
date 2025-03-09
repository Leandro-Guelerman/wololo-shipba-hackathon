'use client'
import type {Message} from "@/app/components/ChatContainer";
import React from 'react';

interface ChatMessageProps {
    message: Message
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
                                                            message,
                                                        }) => {
    if (message.text) {
        return (
            <div className={`flex justify-start mb-4 animate-message-appear`}>
                <div className="w-full p-4 bg-white shadow-sm rounded-2xl border border-gray-100">
                    <p className="text-md whitespace-pre-wrap break-words leading-relaxed text-gray-800">
                        🏝️ {message.text}
                    </p>
                </div>
            </div>
        );
    }

    // Renderizado para mensaje con ítems o clima
    return (
        <div className={'flex justify-start mb-4 animate-message-appear'}>
            <div className="w-full bg-white shadow-sm rounded-2xl border border-gray-100 ">

                {message.message && message.message.type === 'flight' && (
                    <div className="space-y-2 p-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            ✈️
                            Vuelo {message.message.departureLocation?.split(',')[0]} - {message.message.arrivalLocation?.split(',')[0]}
                        </h3>

                        {[message.message.flights?.departure, message.message.flights?.return].map((segment, index) => {
                            if (!segment) {
                                return null;
                            }
                            return (
                                <div key={index} className="flex items-center gap-4 rounded-lg">
                                    <div className="flex items-center flex-1 min-w-0">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">

                                                        <span className="text-sm font-medium text-gray-900">{index === 0 ? message.message?.departureLocation?.split(',')[0] : message.message?.arrivalLocation?.split(',')[0]}</span>
                                                        <span className="text-xs text-gray-500">({index === 0 ? message.message?.departureAirportData?.key : message.message?.arrivalAirportData?.key})</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">{new Date(segment.departure_time).toLocaleString()}</div>
                                        </div>
                                        <div className="flex items-center px-4 flex-col">
                                            {segment.stops > 0 ? (
                                                <span className="text-xs text-gray-500 mb-2">
                {segment.stops} {segment.stops === 1 ? 'escala' : 'escalas'}
              </span>
                                            ) : (
                                                <span className="text-xs text-gray-500 mb-2">Directo</span>
                                            )}
                                            <div className="w-16 h-px bg-gray-300 relative">
                                                {segment.stops > 0 && (
                                                    <div
                                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300"></div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-sm font-medium text-gray-900">{index === 0 ? message.message?.arrivalLocation?.split(',')[0] : message.message?.departureLocation?.split(',')[0]}</span>
                                                <span className="text-xs text-gray-500">({index === 0 ? message.message?.arrivalAirportData?.key : message.message?.departureAirportData?.key})</span>
                                            </div>
                                            <div className="text-xs text-gray-500">{new Date(segment.arrival_time).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                            })
                        }

                        <div className="pt-2">
                            <span
                                className="text-lg font-semibold text-gray-900">${message.message.flights?.return.price}</span>
                        </div>
                    </div>
                )}


                {/*       {message.message && message.message.type === 'flight' && (
                        <div className="space-y-2 p-4">
                            <h3 className='text-lg font-medium text-gray-900'>✈️ Vuelo {message.message.flights?.segments[0].departure.cityName} - {message.message.flights?.segments[0].arrival.cityName} (Ida y vuelta)</h3>
                            {message.message.flights?.segments.map((segment, index) => (
                              <div key={index} className="flex items-center gap-4 rounded-lg">
                                  <div className="flex items-center flex-1 min-w-0">
                                      <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                              <span className="text-sm font-medium text-gray-900">{segment.departure.cityName}</span>
                                              <span className="text-xs text-gray-500">({segment.departure.airport})</span>
                                          </div>
                                          <div className="text-xs text-gray-500">{new Date(segment.departure.date).toLocaleString()}</div>
                                      </div>
                                      <div className="flex items-center px-4 flex-col">
                                          {segment.numberOfStops > 0 && (
                                            <span className="text-xs text-gray-500 mb-2">
                {segment.numberOfStops} {segment.numberOfStops === 1 ? 'escala' : 'escalas'}
            </span>
                                          )}
                                          {segment.numberOfStops === 0 && <span className="text-xs text-gray-500 mb-2">Directo</span>}
                                          <div className="w-16 h-px bg-gray-300 relative">
                                              {segment.numberOfStops > 0 && (<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300"></div>)}
                                          </div>
                                      </div>
                                      <div className="flex-1 min-w-0 text-right">
                                          <div className="flex items-center justify-end gap-2">
                                              <span className="text-sm font-medium text-gray-900">{segment.arrival.cityName}</span>
                                              <span className="text-xs text-gray-500">({segment.arrival.airport})</span>
                                          </div>
                                          <div className="text-xs text-gray-500">{new Date(segment.arrival.date).toLocaleString()}</div>
                                      </div>
                                  </div>
                              </div>
                            ))}
                            <div className="pt-2">
                                <span className="text-lg font-semibold text-gray-900">
                                    ${message.message.flights?.price}
                                </span>
                        </div>
                    </div>
                )}
*/}
                {message.message && message.message.type === 'activities' && message.message.activities && (
                    <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">🏔️ Actividades recomendadas</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                            {message.message.activities.map((activity) => (
                                <div key={activity.name}
                                     className="flex-shrink-0 w-72 bg-white rounded-lg border border-gray-100">
                                    <img
                                        src={activity.thumbnail_url}
                                        alt={activity.name}
                                        className="w-full h-40 object-cover rounded-t-lg"
                                    />
                                    <div className="p-4">
                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{activity.name}</h4>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm text-gray-500">⭐ {activity.ratings}</span>
                                            <span className="text-sm text-gray-500">⏱️ {activity.duration}</span>
                                        </div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {activity.price === 0 ? 'Gratis' : `$${activity.price}`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {message.message && message.message.type === 'weather' && message.message.weather && (
                    message.message.weather.provided_dates && message.message.weather.recommended_dates &&
                    <div className="p-4 bg-amber-100">
                        <h3 className="text-md font-medium  text-gray-900 mb-1">
                            ⛈️ No es el mejor momento para viajar</h3>
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between  rounded-lg">
                                <div>
                                    <div className="flex items-center gap-4 text-gray-900"><div className="flex gap-2">
                              <span className="text-sm px-2 py-1 bg-orange-100 text-orange-700 rounded">🌡 Temp. promedio
                          {message.message.weather.provided_dates.average_weather}°C
                        </span>

                                            {message.message.weather.provided_dates.weather_hazards.rain_chances === 'high' &&
                                                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">🌧️ Alta prob. lluvia</span>}
                                            {message.message.weather.provided_dates.weather_hazards.temperatures === 'high' &&
                                                <span className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded">🌡️ Altas temp.</span>}
                                            {message.message.weather.provided_dates.weather_hazards.high_winds && <span
                                                className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">💨 Vientos fuertes</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className='text-md font-medium text-gray-900 flex justify-between items-center'>Es mas conveniente viajar
                                en {new Date(message.message.weather.recommended_dates.departureDate).toLocaleString('es-ES', {month: 'long'})}
                                <button
                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">✨
                                    ¡Dale, cambiar!</button>
                            </p>
                        </div>
                    </div>)}

                {message.message && message.message.type === 'weather' && message.message.weather &&
                    message.message.weather.provided_dates && !message.message.weather.recommended_dates &&
                    (
                        <div className="p-4 bg-green-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">🌤️ Encontramos el viaje perfecto
                                ✨</h3>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-4 text-gray-900">
                                        <div className="flex gap-2">
                  <span className="text-sm px-2 py-1 bg-orange-100 text-orange-700 rounded">🌡 Temp. promedio {message.message.weather.provided_dates.average_weather}°C
              </span>

                                                {message?.message?.weather?.provided_dates?.weather_hazards.rain_chances === 'high' &&
                                                    <span
                                                        className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">🌧️ Alta prob. lluvia</span>}
                                                {message?.message?.weather?.provided_dates?.weather_hazards.temperatures === 'high' &&
                                                    <span className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded">🌡️ Altas temp.</span>}
                                                {message?.message?.weather?.provided_dates?.weather_hazards.high_winds &&
                                                    <span
                                                        className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">💨 Vientos fuertes</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                {message.message && message.message.type === 'weather' && message.message.weather &&
                    !message.message.weather.provided_dates && message.message.weather.recommended_dates &&
                    (
                        <div className="p-4 bg-emerald-100 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">☀️ Encontramos el viaje perfecto
                                ✨</h3>
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between rounded-lg">
                                    <div>
                                        <div className="flex items-center gap-4 text-gray-900">
                            <div className="flex gap-2">
                              <span className="text-sm px-2 py-1 bg-orange-100 text-orange-700 rounded">🌡 Temp. promedio
                            {message.message.weather.recommended_dates.average_weather}°C
                          </span>

                                                {message.message.weather.recommended_dates.weather_hazards.rain_chances === 'high' &&
                                                    <span
                                                        className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">🌧️ Alta prob. lluvia</span>}
                                                {message.message.weather.recommended_dates.weather_hazards.temperatures === 'high' &&
                                                    <span className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded">🌡️ Altas temp.</span>}
                                                {message.message.weather.recommended_dates.weather_hazards.high_winds &&
                                                    <span
                                                        className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">💨 Vientos fuertes</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)}

                {message.message && message.message.type === 'hotel' && message.message.hotel && (
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        <div className="space-y-2 flex-1 md:p-4 px-2 pb-2">
                            <h3 className="text-lg font-medium text-gray-900">🏨 {message.message.hotel.name}</h3>
                            <p className="text-sm text-gray-500">{message.message.hotel.address}</p>
                            <div className="flex items-center justify-between pt-2">
                                <div className="space-y-1">
                                    <div className="text-xs text-gray-500">Check-in</div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {new Date(message.message.hotel.checkInDate).toLocaleDateString()} 15:00
                                    </div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <div className="text-xs text-gray-500">Check-out</div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {new Date(message.message.hotel.checkOutDate).toLocaleDateString()} 10:00
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2">
                            <span className="text-lg font-semibold text-gray-900">
                                ${message.message.hotel.price}
                            </span>
                            </div>
                        </div>
                        <img
                            src="https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?ca=6&ce=1&s=414x232"
                            alt="Hotel pool view"
                            className="w-full md:w-48 h-32 md:h-auto object-cover rounded-lg"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
