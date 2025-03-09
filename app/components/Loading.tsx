'use client'
import React from 'react';

export const LoadingPlane: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
            <style jsx>{`
                @keyframes fly {
                    0% {
                        transform: translate(-50%, -50%) rotate(-45deg) translateX(-150px);
                        opacity: 0;
                    }
                    20% {
                        opacity: 1;
                    }
                    80% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(-45deg) translateX(150px);
                        opacity: 0;
                    }
                }

                @keyframes cloud-left {
                    0% {
                        transform: translateX(0);
                        opacity: 0;
                    }
                    20% {
                        opacity: 0.8;
                    }
                    80% {
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateX(-200px);
                        opacity: 0;
                    }
                }

                @keyframes cloud-right {
                    0% {
                        transform: translateX(0);
                        opacity: 0;
                    }
                    20% {
                        opacity: 0.8;
                    }
                    80% {
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateX(200px);
                        opacity: 0;
                    }
                }

                .plane-container {
                    position: relative;
                    width: 400px;
                    height: 400px;
                }

                .plane {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    animation: fly 6s infinite ease-in-out;
                }

                .cloud {
                    position: absolute;
                    animation-duration: 12s;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                }

                .cloud-1 { top: 10%; left: 10%; animation-name: cloud-left; }
                .cloud-2 { top: 80%; right: 15%; animation-name: cloud-right; }
                .cloud-3 { top: 25%; left: 25%; animation-name: cloud-left; animation-delay: 2s; }
                .cloud-4 { top: 65%; right: 25%; animation-name: cloud-right; animation-delay: 1s; }
                .cloud-5 { top: 40%; left: 40%; animation-name: cloud-left; animation-delay: 3s; }
                .cloud-6 { top: 15%; right: 35%; animation-name: cloud-right; animation-delay: 4s; }
                .cloud-7 { top: 85%; left: 30%; animation-name: cloud-left; animation-delay: 5s; }
                .cloud-8 { top: 35%; right: 40%; animation-name: cloud-right; animation-delay: 6s; }
                .cloud-9 { top: 70%; left: 15%; animation-name: cloud-left; animation-delay: 7s; }
                .cloud-10 { top: 20%; right: 20%; animation-name: cloud-right; animation-delay: 8s; }
                .cloud-11 { top: 55%; left: 35%; animation-name: cloud-left; animation-delay: 9s; }
                .cloud-12 { top: 45%; right: 10%; animation-name: cloud-right; animation-delay: 10s; }
            `}</style>

            <div className="plane-container">
                {/* Nubes de fondo */}
                {[...Array(12)].map((_, i) => (
                    <svg 
                        key={i} 
                        className={`cloud cloud-${i + 1} ${
                            i % 2 === 0 ? 'w-24 h-24' : 'w-16 h-16'
                        } text-blue-300`}
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path d="M4.5 10.5C4.5 8.01472 6.51472 6 9 6C10.7501 6 12.2699 7.00854 13.0307 8.5C13.4369 8.34499 13.8788 8.25999 14.3409 8.25999C16.362 8.25999 18 9.89797 18 11.919C18 13.9399 16.362 15.5779 14.3409 15.5779L9 15.5779C6.51472 15.5779 4.5 13.5632 4.5 11.0779V10.5Z" />
                    </svg>
                ))}
            </div>
        </div>
    );
};
