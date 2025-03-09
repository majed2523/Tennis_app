'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function TennisBallAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);

  // Start animation after component mounts
  useEffect(() => {
    setIsAnimating(true);

    // Reset animation periodically
    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => setIsAnimating(true), 100);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-16 h-16 ml-4">
      {/* Tennis ball */}
      <motion.div
        className="absolute w-12 h-12 rounded-full bg-[#c3ff5b] border-2 border-white shadow-lg"
        initial={{ x: -100, y: 100, opacity: 0 }}
        animate={
          isAnimating
            ? {
                x: [null, -20, 0, 0],
                y: [null, -40, -20, 0],
                opacity: [null, 1, 1, 1],
                rotate: [null, -180, -360, -360],
              }
            : { x: -100, y: 100, opacity: 0 }
        }
        transition={{
          duration: 1.5,
          times: [0, 0.4, 0.7, 1],
          ease: ['easeOut', 'easeIn', 'easeOut'],
        }}
      >
        {/* Tennis ball curve lines */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/60 transform -translate-y-1/2 rotate-[25deg]"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-white/60 transform -translate-x-1/2 rotate-[25deg]"></div>
        </motion.div>
      </motion.div>

      {/* Shadow */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-8 h-2 bg-black/20 rounded-full -translate-x-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isAnimating
            ? {
                scale: [null, 0.5, 1, 1.2],
                opacity: [null, 0.3, 0.6, 0.2],
              }
            : { scale: 0, opacity: 0 }
        }
        transition={{
          duration: 1.5,
          times: [0, 0.4, 0.7, 1],
          ease: ['easeOut', 'easeIn', 'easeOut'],
        }}
      />
    </div>
  );
}
