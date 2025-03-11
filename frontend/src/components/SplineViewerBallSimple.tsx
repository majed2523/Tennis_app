'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function SplineViewerBallSimple() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Load the Spline viewer script only once
    const script = document.createElement('script');
    script.type = 'module';
    script.src =
      'https://unpkg.com/@splinetool/viewer@1.9.75/build/spline-viewer.js';
    document.head.appendChild(script);

    // Create and configure the spline-viewer element after the script loads
    script.onload = () => {
      if (containerRef.current) {
        const splineViewer = document.createElement('spline-viewer');
        splineViewer.setAttribute(
          'url',
          'https://prod.spline.design/jx47xrmQ67Y9uvGG/scene.splinecode' // Replace this with your scene URL
        );
        splineViewer.setAttribute('camera', 'true'); // Enables camera control in the viewer
        splineViewer.setAttribute('background', 'transparent'); // Optional: Set background transparency
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(splineViewer); // Attach the viewer to the container
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script); // Clean up after component unmount
      }
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="absolute right-[5%] top-[15%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] pointer-events-none z-10"
      whileHover={{
        scale: 1.05, // Slightly scale the court on hover
        rotateY: 15, // Apply a slight Y-axis rotation for interaction effect
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    />
  );
}
