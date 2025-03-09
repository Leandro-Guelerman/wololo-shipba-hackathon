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
                    className={`relative w-20 h-20 rounded-full flex items-center cursor-pointer justify-center transition-all duration-500 shadow-lg ${
                        isDisabled
                            ? 'bg-gray-300 cursor-not-allowed shadow-inner'
                            : isRecording
                                ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 scale-110'
                                : 'bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 hover:scale-105'
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
                    <div className={`absolute inset-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all p-4 duration-500 ${
                        isRecording ? 'scale-90 rotate-90' : 'scale-100 hover:rotate-[-35deg]'
                    }`}>
                        {isRecording ? (
                            <div className="w-6 h-6 rounded-lg bg-white shadow-inner-lg transition-transform duration-300 ease-in-out" />
                        ) : (
                          <svg fill="#FFF" height="800px" width="800px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"  enableBackground="new 0 0 512 512">
                              <g>
                                  <g>
                                      <path d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z"/>
                                      <path d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z"/>
                                  </g>
                              </g>
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


        </div>
    );
};
