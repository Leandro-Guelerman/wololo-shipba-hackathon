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
      <div className="w-full md:w-[600px] mx-auto p-4 h-full">
        <div className="h-full justify-center items-center m-auto">
                <LoadingPlane/>
            </div>

          <div className="flex flex-col items-center space-y-4 w-full max-w-2xl">
                    <div className="self-start ml-4">
                        <ChatLoader />
                    </div>
            </div>
          <div className="fixed w-full md:w-[600px] bottom-0 left-1/2 transform -translate-x-1/2 p-4 justify-center">
                <AudioRecorder onAudioRecorded={handleAudioChange} isProcessing={isProcessing}/>
            </div>
        </div>
    );
}
