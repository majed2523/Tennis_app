'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/api';
import UserRegistrationForm from '../../../components/admin/user-registration-form';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = authService.getCurrentUser();
    if (userData?.role !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">User Registration</h1>
        <p className="text-gray-400 mt-2">
          Create new accounts for players, coaches, or admins
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-center"
      >
        <UserRegistrationForm />
      </motion.div>
    </div>
  );
}
