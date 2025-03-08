'use client'
import {AudioRecorder} from "@/app/components/AudioRecorder2";
import {LoadingPlane} from "@/app/components/Loading";

export default function Home() {

    const handleAudioChange = (audio: { blob: Blob; fileName: string } | null) => {
        if (audio) {
            console.log('Nuevo audio grabado:', audio.blob);
            console.log('Nombre del archivo:', audio.fileName);
        } else {
            console.log('Audio eliminado');
        }
    };

    return (
        <div className="w-full md:w-[600px] mx-auto p-4 h-full">
           <div className="h-full justify-center items-center m-auto">
                <LoadingPlane/>
            </div>
          <div className="fixed w-full md:w-[600px] bottom-0 left-1/2 transform -translate-x-1/2 p-4 justify-center">
                <AudioRecorder onAudioRecorded={() => console.log('recorded')}/>
            </div>
        </div>
    );
}
