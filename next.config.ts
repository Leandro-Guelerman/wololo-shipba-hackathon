import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
        AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
    },
    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination:
                  process.env.NODE_ENV === 'development'
                    ? 'http://127.0.0.1:5328/api/:path*'
                    : '/api/',
            },
        ]
    },
};

export default nextConfig;
