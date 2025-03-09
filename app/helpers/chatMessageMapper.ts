import {ActivityData, HotelData, Message} from "@/app/components/ChatContainer";
import {FlightData, WeatherData} from "@/app/api/travelApi";

export default class ChatMessageMapper {
    static mapText(text: string): Message {
        return {
            id: Date.now().toString(),
            text,
        };
    }

    static mapWeather(data: WeatherData): Message {
        return {
            id: Date.now().toString(),
            message: {
                type: 'weather',
                weather: {
                    provided_dates: data.provided_dates,
                    recommended_dates: data.recommended_dates
                }
            }
        }
    }

    static mapFlight(flightData: FlightData): Message {
        return {
            id: Date.now().toString(),
            message: {
                type: 'flight',
                flights: flightData
            },
        }
    }

    static mapHotel(hotelData: HotelData): Message {
        return {
            id: Date.now().toString(),
            message: {
                type: 'hotel',
                hotel: hotelData
            },
        }
    }

    static mapActivities(activitiesData: ActivityData[]): Message {
        return {
            id: Date.now().toString(),
            message: {
                type: 'activities',
                activities: activitiesData
            }
        }
    }
}