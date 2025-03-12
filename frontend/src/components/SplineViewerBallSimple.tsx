'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function SplineViewerBallSimple() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Load the Spline viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src =
      'https://unpkg.com/@splinetool/viewer@1.9.75/build/spline-viewer.js';
    document.head.appendChild(script);

    // Create the spline-viewer element
    script.onload = () => {
      if (containerRef.current) {
        const splineViewer = document.createElement('spline-viewer');
        // Use the specific scene URL that shows the tennis court
        splineViewer.setAttribute(
          'url',
          'https://prod.spline.design/jx47xrmQ67Y9uvGG/scene.splinecode'
        );
        // Disable camera movement to keep the isometric view
        splineViewer.setAttribute('camera', 'false');
        splineViewer.style.width = '100%';
        splineViewer.style.height = '100%';
        // Clear container and append the viewer
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(splineViewer);
      }
    };

    return () => {
      // Clean up
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="absolute right-[5%] top-[15%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] pointer-events-none z-10"
      animate={{
        y: [-10, 10],
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
      }}
      whileHover={{
        scale: 1.02,
        transition: {
          duration: 0.3,
          ease: 'easeOut',
        },
      }}
    >
      <style jsx global>{`
        spline-viewer {
          transform-style: preserve-3d;
          perspective: 1000px;
          transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        }
      `}</style>
    </motion.div>
  );
}
