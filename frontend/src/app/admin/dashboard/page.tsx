'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Users, UserPlus, Calendar, Settings } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
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

  const userData = authService.getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Welcome back, {userData?.firstName}! Manage your tennis club from
          here.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700 hover:border-green-400 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-green-400" />
                User Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Register and manage users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Create accounts for players, coaches, and admins.
              </p>
              <Link href="/admin/register">
                <Button className="w-full bg-green-600 hover:bg-green-500">
                  Register New User
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-green-400 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                Team Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Create and manage teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Organize players into teams and assign coaches.
              </p>
              <Link href="/admin/teams">
                <Button className="w-full bg-green-600 hover:bg-green-500">
                  Manage Teams
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-green-400 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-400" />
                Schedule Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                View and manage schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                View all lessons and coach availability.
              </p>
              <Link href="/admin/schedule">
                <Button className="w-full bg-green-600 hover:bg-green-500">
                  View Schedules
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-green-400 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-green-400" />
                System Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Manage global settings for the tennis club.
              </p>
              <Link href="/admin/settings">
                <Button className="w-full bg-green-600 hover:bg-green-500">
                  System Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
