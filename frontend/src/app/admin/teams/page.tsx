'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '../../../services/apiService';
import CreateTeamForm from '../../../components/teams/create-teams-form';
import TeamsList from '../../../components/teams/teams-list';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

export default function AdminTeamsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('view');

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!userService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = userService.getCurrentUser();
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
        <h1 className="text-3xl font-bold text-white">Team Management</h1>
        <p className="text-gray-400 mt-2">Create and manage tennis teams</p>
      </motion.div>

      <Tabs
        defaultValue="view"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="view">View Teams</TabsTrigger>
          <TabsTrigger value="create">Create Team</TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="mt-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <TeamsList />
          </motion.div>
        </TabsContent>

        <TabsContent value="create" className="mt-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <CreateTeamForm />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
