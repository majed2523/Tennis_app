'use client';

import { motion } from 'framer-motion';

export default function TennisBallLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
      <div className="relative">
        {/* Tennis ball */}
        <motion.div
          className="w-16 h-16 rounded-full bg-[#c3ff5b] border-2 border-white shadow-lg relative"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        >
          {/* Tennis ball curve lines */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/60 transform -translate-y-1/2 rotate-[25deg]"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-white/60 transform -translate-x-1/2 rotate-[25deg]"></div>
        </motion.div>

        {/* Shadow */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-12 h-3 bg-black/20 rounded-full -translate-x-1/2"
          animate={{
            width: [30, 60, 30],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />

        {/* Loading text */}
        <motion.p
          className="absolute mt-8 text-white text-center w-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}
