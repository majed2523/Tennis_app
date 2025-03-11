'use client';

import { useEffect, useRef } from 'react';

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
        splineViewer.setAttribute(
          'url',
          'https://prod.spline.design/jx47xrmQ67Y9uvGG/scene.splinecode'
        );
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
    <div
      ref={containerRef}
      className="absolute right-[5%] top-[15%] w-[250px] h-[250px] md:w-[300px] md:h-[300px] pointer-events-none z-10"
    />
  );
}
