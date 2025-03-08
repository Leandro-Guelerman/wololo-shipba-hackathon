import { Message } from '../components/ChatContainer';

export const conversationMessages: Message[] = [
    {
        id: 'test1',
        text: 'Me gustaría viajar a Barcelona en verano.',
        isNew: false
    },
    {
        id: 'test2',
        text: '¡Excelente elección! Barcelona es hermosa en verano. ¿Te interesa más la cultura, la playa o la gastronomía?',
        isNew: false
    },
    {
        id: 'test3',
        text: 'Me encanta la gastronomía española, especialmente las tapas.',
        isNew: false
    },
    {
        id: 'test4',
        text: 'Te recomiendo visitar el Mercado de La Boquería en Las Ramblas. Es un paraíso gastronómico con productos frescos y tapas tradicionales.',
        isNew: false
    },
    {
        id: 'test5',
        text: '¿Qué otros lugares emblemáticos debería visitar?',
        isNew: false
    },
    {
        id: 'test6',
        text: 'No puedes perderte la Sagrada Familia, el Parque Güell y el Barrio Gótico. ¿Te gustaría que te dé más detalles sobre alguno de estos lugares?',
        isNew: false
    },
    {
        id: 'test7',
        text: 'Cuéntame más sobre el Parque Güell.',
        isNew: false
    },
    {
        id: 'test8',
        text: 'El Parque Güell es una obra maestra de Gaudí con vistas increíbles de la ciudad. Te recomiendo comprar las entradas con anticipación y visitarlo temprano para evitar las multitudes.',
        isNew: false
    },
    {
        id: 'test9',
        text: '¿Cuántos días recomiendas para visitar Barcelona?',
        isNew: false
    },
    {
        id: 'test10',
        text: 'Para una experiencia completa, te sugiero mínimo 5 días. Así podrás explorar los principales atractivos sin prisa y disfrutar de la vida nocturna.',
        isNew: false
    },
    {
        id: 'test11',
        text: '¿Y qué tal el transporte público?',
        isNew: false
    },
    {
        id: 'test12',
        text: 'El metro de Barcelona es excelente y bien conectado. Te recomiendo comprar la tarjeta T-Casual que te da 10 viajes en cualquier transporte público.',
        isNew: false
    },
    {
        id: 'test13',
        text: '¿Hay playas cerca del centro?',
        isNew: false
    },
    {
        id: 'test14',
        text: 'Sí, la Barceloneta es la playa más famosa y está a solo 10 minutos caminando desde el centro histórico. También puedes visitar playas más tranquilas como Nova Icària.',
        isNew: false
    },
    {
        id: 'test15',
        text: 'Me interesa probar paella auténtica.',
        isNew: false
    },
    {
        id: 'test16',
        text: 'Te recomiendo Can Solé en la Barceloneta o 7 Portes, ambos son restaurantes históricos famosos por sus paellas. ¿Te gustaría que reserve una mesa?',
        isNew: false
    },
    {
        id: 'test17',
        text: 'Sí, me gustaría una reserva en Can Solé.',
        isNew: false
    },
    {
        id: 'test18',
        text: '¿Para cuántas personas y qué fecha tienes pensada?',
        isNew: false
    },
    {
        id: 'test19',
        text: 'Para 4 personas, el próximo viernes.',
        isNew: false
    },
    {
        id: 'test20',
        text: 'Perfecto, buscaré disponibilidad. ¿Prefieres almuerzo o cena?',
        isNew: false
    },
    {
        id: 'test21',
        text: 'Mejor para el almuerzo.',
        isNew: false
    },
    {
        id: 'test22',
        text: 'Excelente elección, el almuerzo es el momento tradicional para la paella. ¿Te parece bien a las 14:00?',
        isNew: false
    },
    {
        id: 'test23',
        text: '¿Qué hay para hacer por la noche en Barcelona?',
        isNew: false
    },
    {
        id: 'test24',
        text: 'Barcelona tiene una vida nocturna vibrante. Puedes disfrutar de bares de tapas en El Born, cocktails en el Barrio Gótico, o clubes nocturnos en el Puerto Olímpico.',
        isNew: false
    },
    {
        id: 'test25',
        text: 'Me gustaría hacer un tour de vinos.',
        isNew: false
    },
    {
        id: 'test26',
        text: 'Puedo recomendarte una excursión a las bodegas del Penedès, famosas por su cava. Es una región vinícola a solo 1 hora de Barcelona.',
        isNew: false
    },
    {
        id: 'test27',
        text: '¿Qué tiempo hace en Barcelona en julio?',
        isNew: false
    },
    {
        id: 'test28',
        message: {
            type: 'weather',
            weather: {
                provided_dates: {
                    departureDate: "2024-07-15",
                    arrivalDate: "2024-07-22",
                    average_weather: 28,
                    weather_hazards: {
                        rain_chances: "low",
                        temperatures: "high",
                        high_winds: false
                    }
                },
                recommended_dates: {
                    departureDate: "2024-06-01",
                    arrivalDate: "2024-06-08",
                    average_weather: 24,
                    weather_hazards: {
                        rain_chances: "normal",
                        temperatures: "normal",
                        high_winds: false
                    }
                }
            }
        },
        isNew: false
    },
    {
        id: 'test29',
        text: 'En julio el clima es caluroso y soleado, con temperaturas entre 25-30°C. Es perfecto para la playa, pero te recomiendo llevar protector solar y mantenerte hidratado.',
        isNew: false
    },
    {
        id: 'test30',
        text: '¿Necesito reservar los museos con anticipación?',
        isNew: false
    },
    {
        id: 'test31',
        text: 'Sí, especialmente para la Sagrada Familia y el Parque Güell es esencial reservar con anticipación. También te recomiendo el pase Barcelona Card si planeas visitar varios museos.',
        isNew: false
    }
]; 