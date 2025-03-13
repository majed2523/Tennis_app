'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/api';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      const userData = authService.getCurrentUser();
      if (userData?.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (userData?.role === 'coach') {
        router.push('/coach/dashboard');
      } else {
        router.push('/player/dashboard');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="py-6 px-8 flex justify-between items-center">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-green-400"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
          <span className="ml-2 text-xl font-bold text-white">Tennis Club</span>
        </div>

        <Link href="/login">
          <Button className="bg-green-600 hover:bg-green-500">Sign In</Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            <span className="text-green-400">Tennis Club</span> Management
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            A comprehensive platform for tennis clubs to manage coaches,
            players, lessons, and teams.
          </p>

          <Link href="/login">
            <Button className="bg-green-600 hover:bg-green-500 text-white text-lg px-8 py-6 rounded-full">
              Get Started
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
        >
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold text-green-400 mb-3">
              For Players
            </h2>
            <p className="text-gray-300 mb-4">
              Book private lessons, view your schedule, and join teams.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold text-green-400 mb-3">
              For Coaches
            </h2>
            <p className="text-gray-300 mb-4">
              Set your availability, manage lessons, and view your teams.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold text-green-400 mb-3">
              For Admins
            </h2>
            <p className="text-gray-300 mb-4">
              Register users, create teams, and manage the entire club.
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="py-6 px-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Tennis Club Management. All rights
        reserved.
      </footer>
    </div>
  );
}
