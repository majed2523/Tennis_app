'use client';

import { motion } from 'framer-motion';

export default function SimpleTennisBall() {
  return (
    <div className="absolute right-[10%] top-[15%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] pointer-events-none z-10">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Shadow */}
        <motion.div
          className="absolute bottom-0 w-32 h-6 bg-black/30 rounded-full blur-sm"
          animate={{
            width: ['8rem', '10rem', '8rem'],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />

        {/* Tennis ball */}
        <motion.div
          className="w-64 h-64 rounded-full bg-[#c5e22b] border-4 border-white shadow-lg relative overflow-hidden"
          animate={{
            rotate: 360,
            y: [0, -20, 0],
          }}
          transition={{
            rotate: {
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            },
            y: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            },
          }}
        >
          {/* Tennis ball felt texture */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-[#b8d428] rounded-full"
                style={{
                  width: `${Math.random() * 10 + 2}px`,
                  height: `${Math.random() * 10 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Tennis ball curved lines */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div
              className="absolute top-1/2 left-0 right-0 h-[6px] bg-white/80 transform -translate-y-1/2 rounded-full"
              style={{
                clipPath: "path('M0,50 Q25,30 50,50 T100,50')",
              }}
            />
            <div
              className="absolute top-0 bottom-0 left-1/2 w-[6px] bg-white/80 transform -translate-x-1/2 rounded-full"
              style={{
                clipPath: "path('M50,0 Q30,25 50,50 T50,100')",
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
