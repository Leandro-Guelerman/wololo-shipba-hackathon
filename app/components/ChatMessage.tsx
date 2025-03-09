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
            <div className={`flex justify-start mb-4 ${
                message.isNew ? 'animate-message-appear' : ''
            }`}>
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
        <div className={`flex justify-start mb-4  ${
            message.isNew ? 'animate-message-appear' : ''
        }`}>
            <div className="w-full bg-white shadow-sm rounded-2xl border border-gray-100 ">
                {message.message && message.message.type === 'flight' && (
                        <div className="space-y-2 p-4">
                            <h3 className='text-lg font-medium text-gray-900'>✈️ Vuelo {message.message.flights?.segments[0].departure.cityName} - {message.message.flights?.segments[0].arrival.cityName}</h3>
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

                        {/*/!* Actividades *!/*/}
                        {/*{message.activities && (*/}
                        {/*    <div className="space-y-4">*/}
                        {/*        <p className="text-sm font-medium text-gray-500 mb-3">Actividades sugeridas:</p>*/}
                        {/*        {message.activities.map((activity, index) => (*/}
                        {/*            <BookingItem*/}
                        {/*                key={index}*/}
                        {/*                {...activity}*/}
                        {/*                type="activity"*/}
                        {/*                hasButton={true}*/}
                        {/*            />*/}
                        {/*        ))}*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                )}



                {message.message && message.message.type === 'hotel' && message.message.hotel && (
                  <div className="flex flex-col-reverse md:flex-row gap-4">
                      <div className="space-y-2 flex-1 md:p-4 px-2 pb-2">
                          <h3 className="text-lg font-medium text-gray-900">🏨 {message.message.hotel.name}</h3>
                          <p className="text-sm text-gray-500">{message.message.hotel.address}</p>
                          <div className="flex items-center justify-between pt-2">
                              <div className="space-y-1">
                                  <div className="text-xs text-gray-500">Check-in</div>
                                  <div className="text-sm font-medium text-gray-900">
                                      {new Date(message.message.hotel.checkInDate).toLocaleDateString()}
                                  </div>
                              </div>
                              <div className="space-y-1 text-right">
                                  <div className="text-xs text-gray-500">Check-out</div>
                                  <div className="text-sm font-medium text-gray-900">
                                      {new Date(message.message.hotel.checkOutDate).toLocaleDateString()}
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
