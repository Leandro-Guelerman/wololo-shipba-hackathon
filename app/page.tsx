'use client'
import {StandaloneAudioRecorder} from "@/app/components/AudioRecorder";

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
    <div className="grid grid-rows-[20px_1fr_20px]
    items-center
    justify-items-center
    min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <StandaloneAudioRecorder onAudioChange={handleAudioChange}/>
    </div>
  );
}
