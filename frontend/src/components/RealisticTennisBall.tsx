'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function RealisticTennisBall() {
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  // Start the animation sequence
  useEffect(() => {
    const startAnimation = async () => {
      setIsAnimating(true);

      // Initial position off-screen
      await controls.start({
        x: -100,
        y: 100,
        scale: 0.5,
        opacity: 0,
        transition: { duration: 0 },
      });

      // First bounce - coming in from left
      await controls.start({
        x: 50,
        y: -20,
        scale: 1,
        opacity: 1,
        rotate: 180,
        transition: {
          duration: 0.8,
          ease: 'easeOut',
        },
      });

      // Second bounce
      await controls.start({
        x: 150,
        y: 30,
        rotate: 360,
        transition: {
          duration: 0.6,
          ease: 'easeIn',
        },
      });

      // Third bounce
      await controls.start({
        x: 250,
        y: -10,
        rotate: 540,
        transition: {
          duration: 0.5,
          ease: 'easeOut',
        },
      });

      // Final position - slowing down
      await controls.start({
        x: 300,
        y: 20,
        rotate: 720,
        transition: {
          duration: 0.7,
          ease: 'easeOut',
        },
      });

      // Reset and repeat after a delay
      setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => startAnimation(), 500);
      }, 2000);
    };

    startAnimation();

    return () => controls.stop();
  }, [controls]);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-10">
      <motion.div className="absolute top-1/2 left-0" animate={controls}>
        {/* Tennis ball with realistic gauge-like appearance */}
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          {/* Main ball with gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#e5ff00] to-[#b5cc00] shadow-lg overflow-hidden">
            {/* Gauge-like seam pattern */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
            >
              {/* Outer circle */}
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1"
              />

              {/* Inner circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1"
              />

              {/* Curved seam lines - gauge style */}
              <path
                d="M50,8 A42,42 0 0,1 92,50"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="opacity-90"
              />

              <path
                d="M50,92 A42,42 0 0,1 8,50"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="opacity-90"
              />

              {/* Tick marks */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 50 + 42 * Math.cos(angle);
                const y1 = 50 + 42 * Math.sin(angle);
                const x2 = 50 + 48 * Math.cos(angle);
                const y2 = 50 + 48 * Math.sin(angle);

                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="white"
                    strokeWidth="1.5"
                    className="opacity-80"
                  />
                );
              })}
            </svg>

            {/* Highlight */}
            <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] rounded-full bg-white/30 blur-[1px]"></div>
          </div>

          {/* Dynamic shadow */}
          <motion.div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-black/30 rounded-full blur-sm"
            animate={
              isAnimating
                ? {
                    width: ['30%', '70%', '60%', '80%', '60%'],
                    opacity: [0.1, 0.3, 0.2, 0.4, 0.2],
                  }
                : { width: '30%', opacity: 0.1 }
            }
            transition={{ duration: 2.6, ease: 'linear' }}
          />
        </div>
      </motion.div>

      {/* Motion trail effect */}
      {isAnimating && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#e5ff00]/10"
              initial={{
                x: -100 + i * 20,
                y: 100 - i * 10,
                opacity: 0.1 - i * 0.02,
                scale: 0.9 - i * 0.1,
              }}
              animate={{
                x: [
                  -100 + i * 20,
                  50 - i * 15,
                  150 - i * 25,
                  250 - i * 35,
                  300 - i * 40,
                ],
                y: [
                  100 - i * 10,
                  -20 + i * 5,
                  30 - i * 5,
                  -10 + i * 5,
                  20 - i * 5,
                ],
              }}
              transition={{
                duration: 2.6,
                ease: 'linear',
                delay: i * 0.05,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
