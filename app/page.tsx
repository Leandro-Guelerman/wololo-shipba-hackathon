'use client'
import {AudioRecorder} from "@/app/components/AudioRecorder2";
import {LoadingPlane} from "@/app/components/Loading";
import {postAudio} from "@/app/api/audioApi";
import {
    Airport,
    ClassifierData,
    FlightData,
    getAirports, getFlightsFromApi,
    getWeatherRecommendation,
    postClassifier,
    WeatherData
} from "@/app/api/travelApi";
import {ChatContainer} from "@/app/components/ChatContainer";
import type {Message} from "@/app/components/ChatContainer";
import {useState, useCallback } from "react";
import {initialMessages} from './testData/initialMessages';
import {conversationMessages} from './testData/conversationMessages';
import {bookingMessages} from './testData/bookingMessages';
import {Toaster, toast} from 'react-hot-toast';

// Combinamos todos los mensajes de prueba
const additionalTestMessages = [...conversationMessages, ...bookingMessages];

export default function Home() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    const [departureAirport, setDepartureAirport] = useState<Airport | undefined>();
    const [arrivalAirport, setArrivalArrivalAirport] = useState<Airport | undefined>();

    const [location, setLocation] = useState<string | undefined>();
    const [arrivalDate, setArrivalDate] = useState<string | undefined>();
    const [departureDate, setDepartureDate] = useState<string | undefined>();
    const [duration, setDuration] = useState<number | undefined>();


    const [weatherRecommendation, setWeatherRecommendation] = useState<WeatherData | undefined>();

    const [flight, setFlight] = useState<FlightData | undefined>();

    const addMessage = useCallback((content: string | Message['message']) => {
        const newMessage = {
            id: Date.now().toString(),
            ...(typeof content === 'string' ? {text: content} : {message: content}),
            isNew: true
        };
        setMessages(prev => [...prev, newMessage]);

        setTimeout(() => {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === newMessage.id ? {...msg, isNew: false} : msg
                )
            );
        }, 500);
    }, []);


    const getClassifierData = async (text: string): Promise<ClassifierData | undefined> => {
        try {
            addMessage(text);

            const response = await postClassifier(text);

            setLocation(response.location?.[0]);
            setDuration(response.duration);
            setArrivalDate(response.arrivalDate);
            setDepartureDate(response.departureDate);

            return response
        } catch (error) {
            console.error('Error al procesar el texto:', error);
            toast.error(error instanceof Error ? error.message : 'Error al procesar tu mensaje');
        } finally {
            setIsProcessing(false);
        }
    }

    const getAirport = async (location: string): Promise<Airport | undefined> => {
        try {
            const response = await getAirports(location);

            const mainAirport = response.main;
            setArrivalArrivalAirport(mainAirport);

            return mainAirport;
        } catch (error) {
            console.error('Error al procesar el texto:', error);
            toast.error(error instanceof Error ? error.message : 'Error al procesar tu mensaje');
        } finally {
            setIsProcessing(false);
        }
    }

    const getWeather = async (
        location: string,
        duration: number,
        departureDate?: string,
        arrivalDate?: string,): Promise<WeatherData | undefined> => {

        try {
            const response = await getWeatherRecommendation(
                location,
                duration,
                departureDate,
                arrivalDate,
            );

            setWeatherRecommendation(response);

            return response;
        } catch (error) {
            console.error('Error al procesar el texto:', error);
            toast.error(error instanceof Error ? error.message : 'Error al procesar tu mensaje');
        } finally {
            setIsProcessing(false);
        }

    }

    const handleTextSubmit = async (text: string) => {
        const classifierData = await getClassifierData(text);
        const mainLocation = classifierData?.location?.[0];

        setIsProcessing(true);

        let departureAirportData: Airport | undefined;
        let arrivalAirportData: Airport | undefined;
        let weatherData: WeatherData | undefined;
        let flightData: FlightData | undefined;
        if (classifierData) {
            departureAirportData = await getAirport('ezeiza');
            arrivalAirportData = await getAirport(classifierData?.location?.[0] as string);
            console.log('departureAirportData', departureAirportData)
        }
        if (arrivalAirportData) {
            addMessage(`Tu destino: ${mainLocation} / Aeropuerto: ${arrivalAirportData.name}`);

        } else {
            addMessage('No te entendí. Podrías repetirlo? - Intenta contandome tu destino deseado.');
        }

        weatherData = await getWeather(mainLocation as string, classifierData?.duration, classifierData?.departureDate, classifierData?.arrivalDate);
        addMessage(`Recomendación de clima obtenida ${weatherData?.recommended_dates.average_weather}`);

        if (weatherData?.recommended_dates)  {
            flightData = await handleRequestFlights(
                departureAirportData?.key as string,
                arrivalAirportData?.key as string,
                weatherData.recommended_dates.departureDate,
                weatherData.recommended_dates.arrivalDate
            );
        }

        if (flightData) {
            addMessage(`Vuelo encontrado con precio: ${flightData.price}`);
        }
        // else (weatherData.requested_dates)

        setIsProcessing(false);
    };

    const handleRequestFlights = async (
        fromAirport: string,
        toAirport: string,
        fromDate: string,
        toDate: string
    ): Promise<FlightData | undefined> => {
        try {
            const response = await getFlightsFromApi(
                fromAirport,
                toAirport,
                fromDate,
                toDate,
            );

            setFlight(response);

            return response;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al procesar tu mensaje');
        } finally {
            setIsProcessing(false);
        }

    }

    const handleAudioChange = async (blob: Blob) => {
        if (blob) {
            try {
                setIsProcessing(true);
                const response = await postAudio(blob);

                const responseData = await response.json();
                console.log('Respuesta de la transcripción:', responseData);

                if (responseData && typeof responseData.text === 'string') {
                    await handleTextSubmit(responseData.text);
                }
            } catch (error) {
                console.error('Error al procesar el audio:', error);
                toast.error('Error al procesar el audio. Por favor, inténtalo de nuevo.');
            } finally {
                setIsProcessing(false);
            }
        }
    };


    const handleTestClick = useCallback(async () => {
        const testText = "Me gustaría viajar a Roma en primavera";
        await handleTextSubmit(testText);
    }, [handleTextSubmit]);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-sky-100 to-white">
            <Toaster position="top-center" />
            {/* Fondo con avión */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <LoadingPlane/>
                </div>
            </div>

            {/* Chat Container */}
            <main className="flex-1 overflow-hidden relative z-10">
                <ChatContainer
                    messages={additionalTestMessages}
                    isLoading={isProcessing}
                />
            </main>

            {/* Footer fijo */}
            <footer
                className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 z-20">
                <div className="max-w-3xl mx-auto">
                    <AudioRecorder
                        onAudioRecorded={handleAudioChange}
                        isProcessing={isProcessing}
                    />
                </div>
            </footer>
        </div>
    );
}
