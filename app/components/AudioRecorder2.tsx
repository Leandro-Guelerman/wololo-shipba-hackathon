'use client'
import React, { useState, useRef, useEffect } from 'react';

interface AudioRecorderProps {
    onAudioRecorded: (blob: Blob) => void;
    enabled?: boolean;
    isProcessing?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
                                                                onAudioRecorded,
                                                                enabled = true,
                                                                isProcessing = false
                                                            }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.stop();
            }
        };
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true
                } 
            });

            // Configurar MediaRecorder para usar codec Opus
            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus',
                audioBitsPerSecond: 128000
            });

            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, {
                    type: 'audio/webm;codecs=opus'
                });
                onAudioRecorded(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setError(null);

        } catch (err) {
            setError('No se pudo acceder al micrófono. Por favor, asegúrate de dar los permisos necesarios.');
            console.error('Error accessing microphone:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const isDisabled = !enabled || isProcessing;

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                {/* Anillos de onda cuando está grabando */}
                {isRecording && (
                    <>
                        <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping" />
                        <div className="absolute inset-[-8px] rounded-full bg-red-500 opacity-10 animate-ping animation-delay-150" />
                        <div className="absolute inset-[-16px] rounded-full bg-red-500 opacity-5 animate-ping animation-delay-300" />
                    </>
                )}

                {/* Botón principal */}
                <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isDisabled}
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                        isDisabled
                            ? 'bg-gray-300 cursor-not-allowed shadow-inner'
                            : isRecording
                                ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 scale-110'
                                : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105'
                    }`}
                    title={
                        isDisabled
                            ? isProcessing
                                ? 'Procesando audio...'
                                : 'Grabación deshabilitada'
                            : isRecording
                                ? 'Detener grabación'
                                : 'Iniciar grabación'
                    }
                >
                    <div className={`absolute inset-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all duration-500 ${
                        isRecording ? 'scale-90 rotate-45' : 'scale-100 hover:rotate-[-35deg]'
                    }`}>
                        {isRecording ? (
                            <div className="w-6 h-6 rounded-lg bg-white shadow-inner-lg transition-transform duration-300 ease-in-out" />
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-white transform transition-transform duration-300 ease-in-out"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        )}
                    </div>

                    {/* Efecto de brillo */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent transition-opacity duration-300 ${
                        isDisabled ? 'opacity-0' : 'opacity-100'
                    }`} />
                </button>
            </div>

            {error && (
                <p className="text-sm text-red-500 text-center font-medium">{error}</p>
            )}

            <p className={`text-sm transition-all duration-300 ${
                isDisabled
                    ? 'text-gray-400'
                    : isRecording
                        ? 'text-red-500 font-medium'
                        : 'text-gray-500'
            }`}>
                {isDisabled
                    ? isProcessing
                        ? '🔄 ...'
                        : '⏸️ ...'
                    : isRecording
                        ? '🔴 Te escucho! :)'
                        : '✈️ Contame tu viaje ideal'}
            </p>
        </div>
    );
};