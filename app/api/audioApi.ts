import { NextResponse } from "next/server";

if (!process.env.AZURE_OPENAI_API_KEY) {
    throw new Error('AZURE_OPENAI_API_KEY no está configurada en las variables de entorno');
}

if (!process.env.AZURE_OPENAI_ENDPOINT) {
    throw new Error('AZURE_OPENAI_ENDPOINT no está configurada en las variables de entorno');
}

const API_KEY = process.env.AZURE_OPENAI_API_KEY;
const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;

export async function postAudio(audioBlob: Blob) {
    try {
        if (!audioBlob) {
            return NextResponse.json({ error: "No se envió un archivo" }, { status: 400 });
        }

        // Crear FormData y agregar el archivo de audio
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('model', 'whisper-1');
        formData.append('language', 'es');

        const response = await fetch(`${ENDPOINT}`, {
            method: "POST",
            headers: {
                "api-key": API_KEY,
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Error en la API: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error en la transcripción:', error);
        return NextResponse.json({ 
            error: "Error en la transcripción", 
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
