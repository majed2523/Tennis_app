'use client';

import { useEffect, useRef } from 'react';

export default function DirectTennisBall() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set the HTML content directly
    containerRef.current.innerHTML = `
      <div style="width: 100%; height: 100%; position: relative;">
        <img 
          src="https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/2LP6UjK0nLgYhTXGBQVY3L/f1d22d88bb5dde2a7fe608d5340b3b19/tennis-ball.png" 
          alt="Tennis Ball" 
          style="width: 100%; height: 100%; object-fit: contain; animation: spin 20s linear infinite, bounce 2s ease-in-out infinite;"
        />
      </div>
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      </style>
    `;
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute right-[5%] top-[15%] w-[250px] h-[250px] md:w-[300px] md:h-[300px] pointer-events-none z-10"
    />
  );
}
