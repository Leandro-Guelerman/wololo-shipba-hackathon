'use client'
import {AudioRecorder} from "@/app/components/AudioRecorder2";
import {LoadingPlane} from "@/app/components/Loading";
// import {postAudio} from "@/app/api/audioApi";
/*import {
    getAirports,
    getFlightsFromApi,
    getWeatherRecommendation,
    postClassifier,
} from "@/app/api/mockedApi";*/
import {
    getAirports,
    getFlightsFromApi,
    getWeatherRecommendation,
    postClassifier,
    Airport,
    ClassifierData,
    getHotelsFromApi, getActivitiesFromApi,
} from "@/app/api/travelApi";
import {ActivityData, ChatContainer, FlightData, HotelData, Message, WeatherData} from "@/app/components/ChatContainer";
import {useState, useCallback} from "react";
import {initialMessages} from './testData/initialMessages';
import {Toaster, toast} from 'react-hot-toast';
import ChatMessageMapper from "@/app/helpers/chatMessageMapper";

// Combinamos todos los mensajes de prueba
// const additionalTestMessages = [...conversationMessages, ...bookingMessages];

export default function Home() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [, setMainLocation] = useState<string | undefined>();

    const [, setPromptedText] = useState<string | undefined>();

    const [departureAirport, setDepartureAirport] = useState<Airport | undefined>();
    const [arrivalAirport, setArrivalArrivalAirport] = useState<Airport | undefined>();

    const [location, setLocation] = useState<string | undefined>();
    const [arrivalDate, setArrivalDate] = useState<string | undefined>();
    const [departureDate, setDepartureDate] = useState<string | undefined>();
    const [duration, setDuration] = useState<number | undefined>();

    const [, setHotel] = useState<HotelData | undefined>();
    const [, setActivities] = useState<ActivityData[] | undefined>();

    const [weatherRecommendation, setWeatherRecommendation] = useState<WeatherData | undefined>();

    const [flight, setFlight] = useState<FlightData | undefined>();

    console.log(departureAirport, arrivalAirport, location, arrivalDate, departureDate, duration, weatherRecommendation, flight);
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

    const resetState = () => {
        setMessages(initialMessages);
        setDepartureAirport(undefined)
        setArrivalArrivalAirport(undefined)

        setLocation(undefined)
        setArrivalDate(undefined)
        setDepartureDate(undefined)
        setDuration(undefined)
        setWeatherRecommendation(undefined)
        setFlight(undefined)
    }

    const getClassifierDataFromApi = async (text: string): Promise<ClassifierData | undefined> => {
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

    const getAirportFromApi = async (location: string): Promise<Airport | undefined> => {
        try {
            const response = await getAirports(location);

            const mainAirport = response.main;

            return mainAirport;
        } catch (error) {
            console.error('Error al procesar el texto:', error);
            toast.error(error instanceof Error ? error.message : 'Error al procesar tu mensaje');
        } finally {
            setIsProcessing(false);
        }
    }

    const getWeatherFromApi = async (
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
            // toast.error(error instanceof Error ? error.message : 'Error al procesar tu mensaje');
            // addMessage('No te entendí. Podrías repetirlo? - Intenta contandome tu destino deseado.');

        } finally {
            setIsProcessing(false);
        }
    }

    /*const handleResubmit = async () => {
        const newQuery = `${mainLocation} ${weatherRecommendation?.recommended_dates?.departureDate} ${weatherRecommendation?.recommended_dates?.arrivalDate}`;
        resetState();
        handleTextSubmit(newQuery);
    }*/

    const handleTextSubmit = async (text: string) => {
        setPromptedText(text);
        const classifierData = await getClassifierDataFromApi(text);
        const mainLocation = classifierData?.location?.[0];

        setMainLocation(mainLocation);
        setIsProcessing(true);

        let departureAirportData: Airport | undefined;
        let arrivalAirportData: Airport | undefined;
        let weatherData: WeatherData | undefined;
        let flightData: FlightData | undefined;
        // let hotelData: HotelData | undefined;

        let travelDateFrom: string | undefined;
        let travelDateTo: string | undefined;

        if (classifierData) {
            departureAirportData = await getAirportFromApi(classifierData.departureLocation?.[0] as string);
            setDepartureAirport(departureAirportData);

            arrivalAirportData = await getAirportFromApi(classifierData?.location?.[0] as string);
            setArrivalArrivalAirport(arrivalAirportData);

            weatherData = await getWeatherFromApi(mainLocation as string, classifierData?.duration as number, classifierData?.departureDate, classifierData?.arrivalDate);

            travelDateFrom = weatherData?.provided_dates?.departureDate as string || weatherData?.recommended_dates?.departureDate as string;
            travelDateTo = weatherData?.provided_dates?.arrivalDate as string || weatherData?.recommended_dates?.arrivalDate as string;

            const weatherMessage = ChatMessageMapper.mapWeather(weatherData as WeatherData)
            addMessage(weatherMessage.message);

            flightData = await handleRequestFlights(
                departureAirportData?.key as string,
                arrivalAirportData?.key as string,
                travelDateFrom,
                travelDateTo
            );

            const flightMessage = ChatMessageMapper.mapFlight(flightData as FlightData, departureAirportData, arrivalAirportData, classifierData.departureLocation?.[0] as string, classifierData?.location?.[0] as string);
            addMessage(flightMessage.message);

            console.log('travelDateTo', travelDateTo);

            const hotelData = await getHotelsFromApi(mainLocation as string, travelDateFrom as string, travelDateTo as string)
            setHotel(hotelData);

            const hotelMessage = ChatMessageMapper.mapHotel(hotelData, travelDateFrom as string, travelDateTo as string);
            addMessage(hotelMessage.message);

            const activities = await getActivitiesFromApi(mainLocation as string, travelDateFrom as string, travelDateTo as string)
            setActivities(activities);

            const activitiesMessage = ChatMessageMapper.mapActivities(activities);
            addMessage(activitiesMessage.message);
        }

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
        resetState();

        if (blob) {
            try {
                setIsProcessing(true);
                // const response = await postAudio(blob);
                // const responseData = await response.json();
                const responseData = {text: 'quiero ir a roma' + Math.random()};

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

    /*const handleTestClick = useCallback(async () => {
        const testText = "Me gustaría viajar a Roma en primavera";
        await handleTextSubmit(testText);
    }, [handleTextSubmit]);*/

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-sky-100 to-white pb-30">
            <Toaster position="top-center"/>
            {/* Fondo con avión */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <LoadingPlane/>
                </div>
            </div>

            {/* Chat Container */}
            <main className="flex-1 overflow-hidden relative z-10">
                <ChatContainer
                    messages={messages}
                    isLoading={isProcessing}
                />
            </main>

            {/* Footer fijo */}
            <footer
                className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 z-20">
                <div className="max-w-3xl mx-auto">
                    {/*<button className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => handleTextSubmit('quiero ir a ver un volcan')}>
                        Mocked data 1
                    </button>*/}
                    <AudioRecorder
                        onAudioRecorded={handleAudioChange}
                        isProcessing={isProcessing}
                    />
                </div>
            </footer>
        </div>
    );
}
