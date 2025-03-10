import { NextResponse } from "next/server";

export async function postAudio(audioBlob: Blob) {
    try {
        if (!audioBlob) {
            return NextResponse.json({ error: "No se envió un archivo" }, { status: 400 });
        }

        // Crear FormData y agregar el archivo de audio
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.webm');

        const response = await fetch(`/api/audio`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Error en la API: ${response.status} - ${errorText}`);
        }

        const jsonResponse = await response.json();
        const data = jsonResponse.text;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error en la transcripción:', error);
        return NextResponse.json({
            error: "Error en la transcripción",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
