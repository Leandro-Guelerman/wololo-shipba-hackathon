import { Message } from '../components/ChatContainer';

export const bookingMessages: Message[] = [
    {
        id: 'test32',
        message: {
            type: 'itemized',
            mainItems: [
                {
                    title: 'Vuelo Madrid-Barcelona',
                    hasButton: true,
                    buttonText: 'Reservar vuelo',
                    bookingUrl: 'https://iberia.com/vuelos/madrid-barcelona',
                    isBooked: false
                },
                {
                    title: 'Hotel Arts Barcelona - 5 noches',
                    hasButton: true,
                    buttonText: 'Reservar hotel',
                    bookingUrl: 'https://hotelarts.com/reservas',
                    isBooked: true
                },
                {
                    title: 'Traslados aeropuerto incluidos',
                    hasButton: false
                }
            ],
            activities: [
                {
                    title: 'Tour gastronómico por el Barrio Gótico',
                    buttonText: 'Reservar tour',
                    bookingUrl: 'https://barcelonatours.com/gastronomic-tour',
                    isBooked: false
                },
                {
                    title: 'Entrada skip-the-line Sagrada Familia',
                    buttonText: 'Comprar entrada',
                    bookingUrl: 'https://sagradafamilia.org/tickets',
                    isBooked: true
                },
                {
                    title: 'Excursión a bodegas del Penedès',
                    buttonText: 'Reservar excursión',
                    bookingUrl: 'https://winetours.com/penedes',
                    isBooked: false
                }
            ]
        },
        isNew: false
    }
];
