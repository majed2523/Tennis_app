'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function TennisBallWorkflow() {
  const [isAnimating, setIsAnimating] = useState(false);

<<<<<<< HEAD
  // Start animation after component mounts
  useEffect(() => {
    // Short delay before starting animation
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 1000);

=======
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 500);
>>>>>>> 7f77fe7 (fixed auth with no ball animation and messy reservation front)
    return () => clearTimeout(timer);
  }, []);

  return (
<<<<<<< HEAD
    <div className="absolute right-0 top-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Large tennis ball */}
      <motion.div
        className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#c3ff5b] border-2 border-white shadow-lg"
        initial={{ x: '120%', y: '30%', rotate: 0 }}
        animate={
          isAnimating
            ? {
                x: ['120%', '50%', '0%', '-10%'],
                y: ['30%', '50%', '90%', '100%'],
                rotate: [0, -180, -360, -450],
              }
            : { x: '120%', y: '30%', rotate: 0 }
        }
        transition={{
          duration: 2.5,
          ease: 'easeOut',
          times: [0, 0.3, 0.7, 1],
        }}
      >
        {/* Tennis ball curve lines */}
=======
    <div className="absolute left-[-80px] top-[50%] w-full h-full overflow-hidden pointer-events-none">
      {/* Tennis Ball Animation */}
      <motion.div
        className="absolute w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#c3ff5b] border-2 border-white shadow-lg"
        initial={{ x: '-120%', y: '40%', rotate: 0 }}
        animate={
          isAnimating
            ? {
                x: ['-120%', '10%', '30%', '50%', '65%'],
                y: ['40%', '35%', '30%', '40%', '42%'], // Smooth arching movement
                rotate: [0, 180, 360, 540], // Continuous spin
              }
            : { x: '-120%', y: '40%', rotate: 0 }
        }
        transition={{
          duration: 2.8,
          ease: 'easeOut',
          times: [0, 0.2, 0.5, 0.7, 1],
        }}
      >
        {/* White Tennis Ball Lines */}
>>>>>>> 7f77fe7 (fixed auth with no ball animation and messy reservation front)
        <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-white/60 transform -translate-y-1/2 rotate-[25deg]"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-[3px] bg-white/60 transform -translate-x-1/2 rotate-[25deg]"></div>
      </motion.div>

<<<<<<< HEAD
      {/* Shadow that grows as ball approaches */}
      <motion.div
        className="absolute rounded-full bg-black/30 blur-sm"
        initial={{ width: 0, height: 0, x: '120%', y: '100%', opacity: 0 }}
        animate={
          isAnimating
            ? {
                width: ['0%', '5%', '10%', '15%'],
                height: ['0px', '4px', '8px', '10px'],
                x: ['120%', '50%', '0%', '-10%'],
                y: ['100%', '100%', '100%', '100%'],
                opacity: [0, 0.3, 0.6, 0.7],
              }
            : { width: 0, height: 0, x: '120%', y: '100%', opacity: 0 }
        }
        transition={{
          duration: 2.5,
          ease: 'easeOut',
          times: [0, 0.3, 0.7, 1],
=======
      {/* Shadow Effect */}
      <motion.div
        className="absolute rounded-full bg-black/30 blur-sm"
        initial={{ width: 0, height: 0, x: '-120%', y: '100%', opacity: 0 }}
        animate={
          isAnimating
            ? {
                width: ['0%', '5%', '8%', '10%'],
                height: ['0px', '4px', '6px', '8px'],
                x: ['-120%', '10%', '30%', '50%', '65%'],
                y: ['100%', '100%', '100%', '100%'],
                opacity: [0, 0.3, 0.6, 0.8],
              }
            : { width: 0, height: 0, x: '-120%', y: '100%', opacity: 0 }
        }
        transition={{
          duration: 2.8,
          ease: 'easeOut',
          times: [0, 0.3, 0.6, 1],
>>>>>>> 7f77fe7 (fixed auth with no ball animation and messy reservation front)
        }}
      />
    </div>
  );
}
