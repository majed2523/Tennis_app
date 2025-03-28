'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/authService';
import CreateTeamForm from '../../../components/teams/create-teams-form';
import TeamsList from '../../../components/teams/teams-list';
import { motion } from 'framer-motion';

export default function AdminTeamsPage() {
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
    <div className="min-h-screen bg-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Team Management</h1>
        <p className="text-gray-600 mt-2">Create and manage tennis teams</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <CreateTeamForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <TeamsList />
        </motion.div>
      </div>
    </div>
  );
}
