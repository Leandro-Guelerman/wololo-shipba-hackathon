

'use client'
import React from 'react';

interface LoadingPlaneProps {
    message?: string;
}

export const LoadingPlane: React.FC<LoadingPlaneProps> = ({
                                                              message = 'Cargando...'
                                                          }) => {
  console.log(message)
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
            <style jsx>{`
        @keyframes fly {
          0% {
            transform: translate(-50%, -50%) rotate(-45deg) translateX(-100px);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(-45deg) translateX(100px);
            opacity: 0;
          }
        }

        @keyframes cloud-left {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translateX(-100px);
            opacity: 0;
          }
        }

        @keyframes cloud-right {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translateX(100px);
            opacity: 0;
          }
        }

        .plane-container {
          position: relative;
          width: 200px;
          height: 200px;
        }

        .plane {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          animation: fly 3s infinite ease-in-out;
        }

        .cloud-left {
          position: absolute;
          top: 40%;
          left: 20%;
          animation: cloud-left 3s infinite ease-in-out;
        }

        .cloud-right {
          position: absolute;
          top: 60%;
          right: 20%;
          animation: cloud-right 3s infinite ease-in-out;
        }
      `}</style>

            <div className="plane-container">
                {/* Nube izquierda */}
                <svg className="cloud-left w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 10.5C4.5 8.01472 6.51472 6 9 6C10.7501 6 12.2699 7.00854 13.0307 8.5C13.4369 8.34499 13.8788 8.25999 14.3409 8.25999C16.362 8.25999 18 9.89797 18 11.919C18 13.9399 16.362 15.5779 14.3409 15.5779L9 15.5779C6.51472 15.5779 4.5 13.5632 4.5 11.0779V10.5Z" />
                </svg>

                {/* Avión */}
                <svg
                    className="plane w-12 h-12 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                </svg>

                {/* Nube derecha */}
                <svg className="cloud-right w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 10.5C4.5 8.01472 6.51472 6 9 6C10.7501 6 12.2699 7.00854 13.0307 8.5C13.4369 8.34499 13.8788 8.25999 14.3409 8.25999C16.362 8.25999 18 9.89797 18 11.919C18 13.9399 16.362 15.5779 14.3409 15.5779L9 15.5779C6.51472 15.5779 4.5 13.5632 4.5 11.0779V10.5Z" />
                </svg>
            </div>

            {/*<p className="mt-4 text-gray-600 animate-pulse">
                {message}
            </p>*/}
        </div>
    );
};
