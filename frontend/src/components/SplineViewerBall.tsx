'use client';
import { motion } from 'framer-motion';

export default function SplineViewerBall() {
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
        {/* Tennis court image */}
        <div className="w-full h-full relative">
          <img
            src="/tennis-court.png"
            alt="Tennis Court"
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback if image doesn't exist
              e.currentTarget.src =
                'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/2LP6UjK0nLgYhTXGBQVY3L/f1d22d88bb5dde2a7fe608d5340b3b19/tennis-court.png';
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
