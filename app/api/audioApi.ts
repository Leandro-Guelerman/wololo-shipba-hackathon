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
        formData.append('audio', audioBlob, 'audio.webm');
        formData.append('definition', JSON.stringify({
            "locales": ["es-MX"],
            "profanityFilterMode": "None",
            "channels": [0]
        }));

        const response = await fetch(`${ENDPOINT}`, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": API_KEY,
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Error en la API: ${response.status} - ${errorText}`);
        }

        const jsonResponse = await response.json();
        const data = jsonResponse.combinedPhrases[0].text;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error en la transcripción:', error);
        return NextResponse.json({
            error: "Error en la transcripción",
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
