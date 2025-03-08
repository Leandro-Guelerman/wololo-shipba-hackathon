'use client'
import {AudioRecorder} from "@/app/components/AudioRecorder2";
import {LoadingPlane} from "@/app/components/Loading";
import {postAudio} from "@/app/api/audioApi";
import {ChatContainer} from "@/app/components/ChatContainer";
import {ChatLoader} from "@/app/components/ChatLoader";
import type {Message} from "@/app/components/ChatContainer";
import {useEffect, useState, useCallback} from "react";
import { initialMessages } from './testData/initialMessages';
import { conversationMessages } from './testData/conversationMessages';
import { bookingMessages } from './testData/bookingMessages';

// Combinamos todos los mensajes de prueba
const additionalTestMessages = [...conversationMessages, ...bookingMessages];

export default function Home() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState<Message[]>(initialMessages);

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

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch('https://vercel-test-flask-five.vercel.app/tools/flights');
            console.log(await result.text());
        };
        fetchData();
    }, []);

    const handleAudioChange = async (blob: Blob) => {
        if (blob) {
            try {
                setIsProcessing(true);
                const response = await postAudio(blob);

                // Asegurarnos de que la respuesta sea un objeto con una propiedad text que sea string
                const responseData = await response.json();
                console.log('Respuesta de la transcripción:', responseData);

                if (responseData && typeof responseData.text === 'string') {
                    addMessage(responseData.text);
                }
            } catch (error) {
                console.error('Error al procesar el audio:', error);
                addMessage("Lo siento, hubo un error al procesar el audio. ¿Podrías intentarlo de nuevo?");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-sky-50 to-white">
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
