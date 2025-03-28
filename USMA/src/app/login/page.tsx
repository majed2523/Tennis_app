'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../components/login-form';
import { authService } from '../../services/authService';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 relative">
            <Image
              src="/logo.png"
              alt="Tennis Club Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back
          </h2>
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
}
