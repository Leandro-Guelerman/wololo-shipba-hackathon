'use client'
import {AudioRecorder} from "@/app/components/AudioRecorder2";
import {LoadingPlane} from "@/app/components/Loading";
import {postAudio} from "@/app/api/audioApi";
import {ChatLoader} from "@/app/components/ChatLoader";
import {useState} from "react";

export default function Home() {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAudioChange = async (blob: Blob) => {
        if (blob) {
            try {
                setIsProcessing(true);
                const response = await postAudio(blob);
                console.log('Respuesta de la transcripción:', response);
            } catch (error) {
                console.error('Error al procesar el audio:', error);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px]
    items-center
    justify-items-center
    min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div className={'justify-center items-center m-auto'}>
                <LoadingPlane/>
            </div>

          <div className="flex flex-col items-center space-y-4 w-full max-w-2xl">
                    <div className="self-start ml-4">
                        <ChatLoader />
                    </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gray-200 p-4 justify-center">
                <AudioRecorder onAudioRecorded={handleAudioChange} isProcessing={isProcessing}/>
            </div>
        </div>
    );
}
