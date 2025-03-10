import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        NEXT_PUBLIC_WOLOLO_API_URL: process.env.WOLOLO_API_URL,
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
