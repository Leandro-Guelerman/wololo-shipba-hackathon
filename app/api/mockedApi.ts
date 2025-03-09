/*
import {ActivityData, FlightData, HotelData, WeatherData} from "@/app/components/ChatContainer";
import {AirportsResponse, ClassifierData} from "./travelApi";


export const postClassifier = async (text: string): Promise<ClassifierData> => {
    return {
        location: ['Madrid'],
        arrivalDate: '2022-10-10',
        departureDate: '2022-10-07',
        duration: 3,
    }
};

export const getAirports = async (location: string): Promise<AirportsResponse> => {
    return {
        main: {
            international: false,
            key: 'MAD',
            name: 'Madrid',
        },
        others: [
            {
                international: true,
                key: 'BCN',
                name: 'Barcelona',
            },
            {
                international: true,
                key: 'LHR',
                name: 'London',
            },
        ],
    }
};

export const getWeatherRecommendation = async (
    location: string,
    duration: number,
    departureDate?: string,
    arrivalDate?: string,
): Promise<WeatherData> => {
    return {
        provided_dates: {
            departureDate: '2022-10-07',
            arrivalDate: '2022-10-10',
            average_weather: 20,
            weather_hazards: {
                rain_chances: 'low',
                temperatures: 'medium',
                high_winds: false,
            },
        },
        recommended_dates: {
            departureDate: '2022-10-07',
            arrivalDate: '2022-10-10',
            average_weather: 20,
            weather_hazards: {
                rain_chances: 'low',
                temperatures: 'medium',
                high_winds: false,
            },
        },
    }
};

export const getFlightsFromApi = async (
    fromAirport: string,
    toAirport: string,
    fromDate: string,
    toDate: string
): Promise<FlightData> => {
    return {
        segments: [
            {
                departure: {
                    cityName: 'Madrid',
                    airport: 'MAD',
                    date: '2022-10-07',
                },
                arrival: {
                    cityName: 'Barcelona',
                    airport: 'BCN',
                    date: '2022-10-07',
                },
                duration: '1h',
                numberOfStops: 0,
            },
            {
                departure: {
                    cityName: 'Barcelona',
                    airport: 'BCN',
                    date: '2022-10-10',
                },
                arrival: {
                    cityName: 'Madrid',
                    airport: 'MAD',
                    date: '2022-10-10',
                },
                duration: '1h',
                numberOfStops: 0,
            },
        ],
        price: 100,
    }
};

export const getHotelsFromApi = async (
    location: string,
    fromDate: string,
    toDate: string
): Promise<HotelData> => {
    return {
        name: 'Hotel Madrid',
        address: 'Calle Madrid 123',
        checkInDate: '2022-10-07',
        checkOutDate: '2022-10-10',
        price: 100,
    }
};

export const getActivities = async (
    location: string,
    fromDate: string,
    toDate: string
): Promise<ActivityData[]> => {
    return [
        {
            price: 100,
            duration: '1h',
            href: 'https://www.google.com',
            name: 'Museo del Prado',
            ratings: 5,
            thumbnail_url: 'https://www.google.com',
        },
        {
            price: 100,
            duration: '1h',
            href: 'https://www.google.com',
            name: 'Museo Reina Sofia',
            ratings: 5,
            thumbnail_url: 'https://www.google.com',
        },
    ]
};


*/
