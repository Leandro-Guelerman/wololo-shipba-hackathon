export interface ClassifierData {
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

interface AirportsResponse {
    main: Airport;
    others: Airport[];
}

export interface WeatherData {
    "recommended_dates": {
        "arrivalDate": string;
        "average_weather": number;
        "departureDate": string;
        "weather_hazards": {
            "high_winds": boolean;
            "rain_chances": string;
            "temperatures": string;
        }
    }
}

export interface FlightData {
    price: string;
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
        console.log('Respuesta del clasificador:', data);
        
        return data;
    } catch (error) {
        console.error('Error en postClassifier:', error);
        throw error;
    }
};

export const getAirports = async (location: string): Promise<AirportsResponse> => {
    try {
        const encodedLocation = encodeURIComponent(location);
        const result = await fetch(`${API_URL}/locations/${encodedLocation}/airports`);

        const data = await result.json();
        console.log('Respuesta de aeropuertos:', data);

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
        let url = `${API_URL}/locations/${location}/duration/${duration}/weather`;
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
        let url = `${API_URL}/flights/${fromAirport}/${toAirport}/${fromDate}/${toDate}/${passengers}`;
        const result = await fetch(url);
        const data = await result.json();

        return data;
    } catch (error) {
        console.error('Error en getWeatherRecommendation:', error);
        throw error;
    }
};

//
// export const getActivities = async (
//     location: string,
// ): Promise<WeatherData> => {
//     try {
//         let url = `${API_URL}/civitatis/${location}`;
//         if (arrivalDate && departureDate) {
//             url += `?departureDate=${departureDate}&arrivalDate=${arrivalDate}`;
//         }
//
//         const result = await fetch(url);
//         const data = await result.json();
//
//         return data;
//     } catch (error) {
//         console.error('Error en getWeatherRecommendation:', error);
//         throw error;
//     }
// };