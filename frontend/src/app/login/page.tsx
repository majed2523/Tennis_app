'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../components/login-form';
import { authService } from '../../services/api';
import { motion } from 'framer-motion';

export default function LoginPage() {
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
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 text-green-400"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
}
