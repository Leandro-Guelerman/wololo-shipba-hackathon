import { Message } from '../components/ChatContainer';

export const conversationMessages: Message[] = [
    {
        id: 'test1',
        text: 'Me gustaría viajar a Barcelona en verano.',
    },
    {
        id: 'test4',
        message: {
            type: 'weather',
            weather: {
                provided_dates: {
                    arrivalDate: "2025-05-08",
                    average_weather: 18,
                    departureDate: "2025-05-01",
                    weather_hazards: {
                        high_winds: false,
                        rain_chances: "medium",
                        temperatures: "high"
                    }
                },
                recommended_dates: {
                    arrivalDate: "2025-07-08",
                    average_weather: 18,
                    departureDate: "2025-07-01",
                    weather_hazards: {
                        high_winds: false,
                        rain_chances: "medium",
                        temperatures: "high"
                    }
                }
            }


        },
    },
    {
        id: 'test2',
        message: {
            type: 'flight',
            flights: {
                segments: [{
                    departure: {
                        cityName: 'Madrid',
                        airport: 'MAD',
                        date: '2024-07-15T08:00:00Z'
                    },
                    arrival: {
                        cityName: 'Barcelona',
                        airport: 'BCN',
                        date: '2024-07-15T09:30:00Z'
                    },
                    duration: '12hs 30m',
                    numberOfStops: 1
                }, {
                    departure: {
                        cityName: 'Barcelona',
                        airport: 'BCN',
                        date: '2024-07-15T08:00:00Z'
                    },
                    arrival: {
                        cityName: 'Madrid',
                        airport: 'MAD',
                        date: '2024-07-15T09:30:00Z'
                    },
                    duration: '12hs 30m',
                    numberOfStops: 2
                }],
                price: 600
            }
        },
    },
    {
        id: 'test3',
        message: {
            type: 'hotel',
            hotel: {
                name: 'Hotel Arts Barcelona',
                address: 'Carrer de la Marina, 19-21, 08005 Barcelona, España',
                checkInDate: '2024-07-15',
                checkOutDate: '2024-07-22',
                price: 1200
            }
        },
    },
    {
        id: 'test5',
        message: {
            type: 'activities',
            activities: [{
                duration: "2 horas",
                href: "https://civitatis.com/ar/barcelona/free-tour-misterios-leyendas-barrio-gotico/",
                name: "Free tour de los misterios y leyendas del Barrio Gótico",
                price: 0,
                ratings: 9.4,
                thumbnail_url: "https://civitatis.com/f/espana/barcelona/free-tour-misterios-leyendas-barrio-gotico-list.jpg"
            },
                {
                    duration: "2 horas",
                    href: "https://civitatis.com/ar/barcelona/free-tour-misterios-leyendas-barrio-gotico/",
                    name: "Free tour de los misterios y leyendas del Barrio Gótico",
                    price: 0,
                    ratings: 9.4,
                    thumbnail_url: "https://civitatis.com/f/espana/barcelona/free-tour-misterios-leyendas-barrio-gotico-list.jpg"
                },
                {
                    duration: "2 horas",
                    href: "https://civitatis.com/ar/barcelona/free-tour-misterios-leyendas-barrio-gotico/",
                    name: "Free tour de los misterios y leyendas del Barrio Gótico",
                    price: 0,
                    ratings: 9.4,
                    thumbnail_url: "https://civitatis.com/f/espana/barcelona/free-tour-misterios-leyendas-barrio-gotico-list.jpg"
                }]
        }
    }

];
