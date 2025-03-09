import {ActivityData, FlightData, HotelData, Message, WeatherData} from "@/app/components/ChatContainer";
import {Airport} from "@/app/api/travelApi";

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

    static mapFlight(flightData: FlightData, departureAirportData?: Airport, arrivalAirportData?: Airport, departureLocation?: string, arrivalLocation?: string): Message {
        return {
            id: Date.now().toString(),
            message: {
                type: 'flight',
                flights: flightData,
                departureAirportData,
                arrivalAirportData,
                departureLocation,
                arrivalLocation
            },
        }
    }

    static mapHotel(hotelData: HotelData, travelDateFrom : string, travelDateTo : string): Message {

        const dateFromLabel = new Intl.DateTimeFormat("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date(travelDateFrom + "T00:00:00"));

        const travelDateToLabel = new Intl.DateTimeFormat("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date(travelDateTo + "T00:00:00"));


        return {
            id: Date.now().toString(),
            message: {
                type: 'hotel',
                hotel: hotelData,
                travelDateFrom: dateFromLabel,
                travelDateTo: travelDateToLabel
            },
        }
    }

    static mapActivities(activitiesData: ActivityData[]): Message {
        return {
            id: Date.now().toString(),
            message: {
                type: 'activities',
                activities: activitiesData || []
            }
        }
    }
}