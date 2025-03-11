'use client';

import { motion } from 'framer-motion';

export default function StaticTennisCourt() {
  return (
    <div className="absolute right-[5%] top-[15%] w-[250px] h-[250px] md:w-[300px] md:h-[300px] pointer-events-none z-10">
      <motion.div
        className="w-full h-full"
        animate={{
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 3,
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
