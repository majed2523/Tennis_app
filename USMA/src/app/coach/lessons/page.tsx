'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/authService';
import LessonsList from '../../../components/lessons/lessons-list';
import { motion } from 'framer-motion';

export default function CoachLessonsPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and is a coach
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = authService.getCurrentUser();
    if (userData?.role !== 'coach') {
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
        <h1 className="text-3xl font-bold text-white">
          Your Coaching Schedule
        </h1>
        <p className="text-gray-400 mt-2">
          View all your upcoming lessons with students
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LessonsList role="coach" />
      </motion.div>
    </div>
  );
}
