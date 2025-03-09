'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import FeatureCards from '../components/FeatureCard';
import RealisticTennisBall from '../components/RealisticTennisBall';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col justify-center items-center text-center px-6 pt-24 md:pt-32 relative overflow-hidden"
      >
        {/* Tennis court background lines */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-green-500/10 transform -translate-y-1/2"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-green-500/10 transform -translate-x-1/2"></div>
          <div className="absolute top-[20%] left-[20%] right-[20%] bottom-[20%] border border-green-500/10"></div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg z-10"
        >
          <span className="text-green-400">Elevate</span> Your Game
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl text-gray-300 max-w-3xl mt-4 md:mt-6 z-10"
        >
          Join us for world-class coaching, premium courts, and a vibrant tennis
          community.
        </motion.p>

        {/* Call to Action Button with Tennis Ball Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-6 md:mt-8 z-10"
        >
          <Link
            href="/register"
            className="bg-green-600 hover:bg-green-500 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg transition"
          >
            Get Started
          </Link>
        </motion.div>

        {/* Realistic Tennis Ball Animation */}
        <RealisticTennisBall />
      </motion.section>

      {/* Space between Hero and Feature Cards */}
      <div className="mt-24">
        {/* Feature Cards Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-green-400"></h2>
        </div>
        <FeatureCards />
      </div>
    </div>
  );
}
