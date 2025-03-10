'use client';

import { motion } from 'framer-motion';

export default function TennisBallLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
<<<<<<< HEAD
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
=======
      <motion.div
        className="w-16 h-16 rounded-full bg-[#c3ff5b] border-2 border-white shadow-lg relative"
        animate={{
          y: [0, -20, 0], // Smoother bounce effect
          rotate: [0, 180, 360], // Full spin
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Curved lines on the ball */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/60 transform -translate-y-1/2 rotate-[25deg]"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-white/60 transform -translate-x-1/2 rotate-[25deg]"></div>
      </motion.div>

      {/* Shadow effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-12 h-3 bg-black/20 rounded-full -translate-x-1/2"
        animate={{ width: [30, 50, 30], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Loading Text */}
      <motion.p
        className="absolute mt-8 text-white text-center w-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading...
      </motion.p>
>>>>>>> 7f77fe7 (fixed auth with no ball animation and messy reservation front)
    </div>
  );
}
