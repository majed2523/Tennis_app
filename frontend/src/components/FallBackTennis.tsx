'use client';

import { motion } from 'framer-motion';

export default function FallbackTennisBall() {
  return (
    <div className="absolute right-[5%] top-[15%] w-[250px] h-[250px] md:w-[300px] md:h-[300px] pointer-events-none z-10 flex items-center justify-center">
      <motion.div
        className="w-[200px] h-[200px] rounded-full bg-[#c5e22b] shadow-lg relative overflow-hidden"
        animate={{
          rotate: 360,
          y: [0, -10, 0],
        }}
        transition={{
          rotate: {
            duration: 20,
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
        {/* Tennis ball curved lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div
            className="absolute top-1/2 left-0 right-0 h-[4px] bg-white/70 transform -translate-y-1/2"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              borderRadius: '2px',
            }}
          />
          <div
            className="absolute top-0 bottom-0 left-1/2 w-[4px] bg-white/70 transform -translate-x-1/2"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              borderRadius: '2px',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
