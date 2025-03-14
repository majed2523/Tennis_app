'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/authService';
import BookLessonForm from '../../../components/lessons/book-lessons-form'
import LessonsList from '../../../components/lessons/lessons-list';
import { motion } from 'framer-motion';

export default function PlayerLessonsPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and is a player
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = authService.getCurrentUser();
    if (userData?.role !== 'player') {
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
        <h1 className="text-3xl font-bold text-white">Book Private Lessons</h1>
        <p className="text-gray-400 mt-2">
          Schedule one-on-one sessions with our professional coaches
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <BookLessonForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <LessonsList role="player" />
        </motion.div>
      </div>
    </div>
  );
}
