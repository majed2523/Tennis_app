'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Spline to avoid SSR issues
// Use a non-async loading component
const Spline = dynamic(() => import('@splinetool/react-spline/next'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-12 h-12 rounded-full border-4 border-green-400 border-t-transparent animate-spin"></div>
    </div>
  ),
});

export default function SplineTennisBall() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute right-0 top-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute right-[5%] top-[20%] w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
        <Spline scene="https://prod.spline.design/FS5abDYkOxryFhmd/scene.splinecode" />
      </div>
    </div>
  );
}
