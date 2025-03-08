import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
        AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
    },
};

export default nextConfig;
