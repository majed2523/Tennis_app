'use client';

import { motion } from 'framer-motion';

export default function StaticTennisCourt() {
  return (
    <div className="absolute right-[5%] top-[15%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] pointer-events-none z-10">
      <motion.div
        className="w-full h-full"
        whileHover={{
          scale: 1.05, // Slightly scale up the court on hover
          rotateY: 10, // Apply a slight Y-axis rotation for interaction effect
        }}
        whileTap={{
          scale: 0.98, // Slightly scale down when clicked
        }}
        animate={{
          rotateY: [0, 15, 0], // Adds dynamic rotation effect to the court
          scale: [1, 1.05, 1], // Adds slight scaling for depth effect
          y: [-10, 10, -10], // Adds a bouncing effect for a more dynamic feel
        }}
        transition={{
          duration: 6,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'loop',
        }}
      >
        {/* Tennis court using CSS */}
        <div className="w-full h-full relative perspective-[800px]">
          <div
            className="w-full h-full bg-green-500 rounded-md border-2 border-white transform rotate-x-[60deg] shadow-xl"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Court lines */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white transform -translate-y-1/2"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-white transform -translate-x-1/2"></div>

            {/* Service boxes */}
            <div className="absolute top-1/4 left-1/4 right-1/2 bottom-1/2 border border-white"></div>
            <div className="absolute top-1/4 left-1/2 right-1/4 bottom-1/2 border border-white"></div>
            <div className="absolute top-1/2 left-1/4 right-1/2 bottom-3/4 border border-white"></div>
            <div className="absolute top-1/2 left-1/2 right-1/4 bottom-3/4 border border-white"></div>

            {/* Baseline */}
            <div className="absolute top-[10%] left-[10%] right-[10%] bottom-[85%] border-2 border-white"></div>
            <div className="absolute top-[85%] left-[10%] right-[10%] bottom-[10%] border-2 border-white"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
