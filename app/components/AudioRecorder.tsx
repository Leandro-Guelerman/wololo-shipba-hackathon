'use client'
import React, { useState, useRef, useEffect } from 'react';

interface StandaloneAudioRecorderProps {
    onAudioChange?: (audio: { blob: Blob; fileName: string } | null) => void;
}

export const StandaloneAudioRecorder: React.FC<StandaloneAudioRecorderProps> = ({
                                                                                    onAudioChange
                                                                                }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Intentar crear el MediaRecorder con codec OGG
            try {
                mediaRecorderRef.current = new MediaRecorder(stream, {
                    mimeType: 'audio/ogg;codecs=opus'
                });
            } catch (e) {
                // Si OGG no es soportado, intentar con WebM
                try {
                    mediaRecorderRef.current = new MediaRecorder(stream, {
                        mimeType: 'audio/webm;codecs=opus'
                    });
                } catch (e2) {
                    // Si ninguno funciona, usar el formato por defecto
                    mediaRecorderRef.current = new MediaRecorder(stream);
                }
            }

            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                // Determinar el tipo MIME correcto basado en el formato usado
                const mimeType = mediaRecorderRef.current?.mimeType || 'audio/ogg';
                const fileExtension = mimeType.includes('ogg') ? 'ogg' : 'webm';

                const blob = new Blob(chunksRef.current, { type: mimeType });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);

                // Notificar al componente padre sobre el cambio de audio
                onAudioChange?.({
                    blob,
                    fileName: `note.${fileExtension}`
                });

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setError(null);

            // Iniciar el temporizador
            let seconds = 0;
            timerRef.current = setInterval(() => {
                seconds++;
                setRecordingTime(seconds);
            }, 1000);

        } catch (err) {
            setError('No se pudo acceder al micrófono. Por favor, asegúrate de dar los permisos necesarios.');
            console.error('Error accessing microphone:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleDelete = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(null);
        onAudioChange?.(null);
    };

    return (
        <div className="space-y-4">
            <style jsx>{`
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                    }

                    70% {
                        transform: scale(1.05);
                        box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
                    }

                    100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                    }
                }

                @keyframes recording-pulse {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                    }

                    70% {
                        transform: scale(1.05);
                        box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
                    }

                    100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
                    }
                }

                .recording-ring {
                    animation: recording-pulse 2s infinite;
                }

                .standby-ring {
                    animation: pulse 2s infinite;
                }
            `}</style>

            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    {/* Anillo exterior animado */}
                    <div className={`absolute inset-0 rounded-full ${
                        isRecording ? 'recording-ring bg-red-500' : 'standby-ring bg-blue-500'
                    }`} />

                    {/* Botón principal */}
                    <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isRecording
                                ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                        }`}
                    >
                        <div className={`absolute inset-2 rounded-full bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 ${
                            isRecording ? 'scale-90' : 'scale-100'
                        }`}>
                            {isRecording ? (
                                // Ícono de parar
                                <div className="w-8 h-8 rounded-lg bg-white" />
                            ) : (
                                // Ícono de avión
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-white transform -rotate-45"
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
                    </button>
                </div>

                {isRecording && (
                    <div className="text-center animate-fade-in">
                        <p className="text-sm font-medium text-gray-900 mb-1">Grabando tu mensaje...</p>
                        <p className="text-3xl font-bold text-red-500">{formatTime(recordingTime)}</p>
                    </div>
                )}

                {!isRecording && !audioUrl && (
                    <p className="text-sm text-gray-500 text-center">
                        Toca el avión para grabar tu mensaje
                    </p>
                )}

                {audioUrl && !isRecording && (
                    <div className="w-full animate-fade-in">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-700">Tu mensaje:</p>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="text-sm text-red-600 hover:text-red-800 transition-colors flex items-center space-x-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Eliminar</span>
                            </button>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                            <audio controls className="w-full">
                                <source src={audioUrl} type={mediaRecorderRef.current?.mimeType || 'audio/ogg'} />
                                Tu navegador no soporta el elemento de audio.
                            </audio>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}
            </div>
        </div>
    );
};