import {ActivityData, FlightData, HotelData, WeatherData} from "../components/ChatContainer";

export interface ClassifierData {
    departureLocation?: string[];
    location?: string[];
    "arrivalDate"?: string;
    "departureDate"?: string;
    "duration"?: number;
    error?: string;
}

export interface Airport {
    international: boolean;
    key: string;
    name: string;
}

export interface AirportsResponse {
    main: Airport;
    others: Airport[];
}

if (!process.env.NEXT_PUBLIC_WOLOLO_API_URL) {
    throw new Error('NEXT_PUBLIC_WOLOLO_API_URL no está configurada en las variables de entorno');
}

const API_URL = process.env.NEXT_PUBLIC_WOLOLO_API_URL;

export const postClassifier = async (text: string): Promise<ClassifierData> => {
    try {

        const result = await fetch(`${API_URL}/classifier`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }),
        });

        const data = await result.json();

        return data;
    } catch (error) {
        console.error('Error en postClassifier:', error);
        throw error;
    }
};

export const getAirports = async (location: string): Promise<AirportsResponse> => {
    try {
        const result = await fetch(`${API_URL}/locations/${location.split(',')[0]}/airports`);

        const data = await result.json();

        if (!data.main || !data.others) {
            throw new Error('La respuesta no tiene el formato esperado de aeropuertos');
        }

        return data;
    } catch (error) {
        console.error('Error en getAirports:', error);
        throw error;
    }
};

export const getWeatherRecommendation = async (
    location: string,
    duration: number,
    departureDate?: string,
    arrivalDate?: string,
): Promise<WeatherData> => {
    try {
        let url = `${API_URL}/locations/${location.split(',')[0]}/duration/${duration}/weather`;
        if (arrivalDate && departureDate) {
            url += `?departureDate=${departureDate}&arrivalDate=${arrivalDate}`;
        }

        const result = await fetch(url);
        const data = await result.json();

        return data;
    } catch (error) {
        console.error('Error en getWeatherRecommendation:', error);
        throw error;
    }
};

export const getFlightsFromApi = async (
    fromAirport: string,
    toAirport: string,
    fromDate: string,
    toDate: string
): Promise<FlightData> => {
    const passengers = 1;
    try {
        const url = `${API_URL}/flights/${fromAirport}/${toAirport}/${fromDate}/${toDate}/${passengers}`;
        const result = await fetch(url);
        const data = await result.json();

        return data;
    } catch (error) {
        console.error('Error en getFlightsFromApi:', error);
        throw error;
    }
};

export const getHotelsFromApi = async (
    location: string,
    fromDate: string,
    toDate: string
): Promise<HotelData> => {
    try {
        const url = `${API_URL}/hotels/${location.split(',')[0]}/${fromDate}/${toDate}`;
        const result = await fetch(url);
        const data = await result.json();

        return data[0];
    } catch (error) {
        console.error('Error en getHotelsFromApi:', error);
        throw error;
    }
};

export const getActivitiesFromApi = async (
    location: string,
    fromDate: string,
    toDate: string
): Promise<ActivityData[]> => {
    try {
        let url = `${API_URL}/civitatis/${location.split(',')[0]}`;
        if (fromDate && toDate) {
            url += `?fromDate=${fromDate}&toDate=${toDate}`;
        }

        const result = await fetch(url);
        const data = await result.json();

        return data;
    } catch (error) {
        console.error('Error en getWeatherRecommendation:', error);
        throw error;
    }
};
