'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function HomeTennisBall() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Short delay before showing the ball
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-[30%] right-[10%] md:right-[20%]"
        initial={{ x: 200, y: -100, opacity: 0 }}
        animate={{
          x: 0,
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 10,
            duration: 1.5,
          },
        }}
      >
        {/* Tennis ball */}
        <div className="relative w-16 h-16 md:w-24 md:h-24">
          <motion.div
            className="absolute inset-0 rounded-full bg-[#CFE635] border-2 border-white shadow-lg"
            animate={{
              rotate: 360,
              transition: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
              },
            }}
          >
            {/* Tennis ball curve lines */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/60 transform -translate-y-1/2 rotate-[25deg]"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-white/60 transform -translate-x-1/2 rotate-[25deg]"></div>
          </motion.div>

          {/* Shadow */}
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full bg-black/30 blur-sm"
            initial={{ width: 10, height: 3 }}
            animate={{
              width: [null, 30, 40, 30],
              height: [null, 6, 8, 6],
              transition: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
                ease: 'easeInOut',
              },
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
