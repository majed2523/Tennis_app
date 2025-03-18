'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import {
  Users,
  UserPlus,
  Calendar,
  BarChart3,
  FileText,
  Server,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authService } from '../../../services/authService';

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

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Stats data
  const stats = [
    {
      title: 'Total Members',
      value: '124',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Coaches',
      value: '8',
      change: '+2',
      icon: UserPlus,
      color: 'bg-green-500',
    },
    {
      title: 'Courts',
      value: '6',
      change: '100%',
      icon: Server,
      color: 'bg-purple-500',
    },
    {
      title: 'Weekly Sessions',
      value: '42',
      change: '+8%',
      icon: Calendar,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with animated gradient border */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 p-6 md:p-8 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-xl"></div>
          <div className="absolute inset-0 bg-gray-800/90 backdrop-blur-sm rounded-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Shield className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400 mt-1">
                  Welcome back, {userData?.firstName}! Manage your tennis club
                  from here.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={item}>
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">
                        {stat.title}
                      </p>
                      <h3 className="text-3xl font-bold text-white mt-1">
                        {stat.value}
                      </h3>
                      <p className="text-green-400 text-sm mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}/20`}>
                      <stat.icon
                        className={`h-6 w-6 text-${
                          stat.color.split('-')[1]
                        }-400`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={item} className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <UserPlus className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">
                      User Management
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Register and manage users
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <Link
                      href="/admin/register"
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-300">Register New User</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <UserPlus className="h-4 w-4 text-green-400" />
                      </Button>
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <Link
                      href="/admin/users"
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-300">View All Users</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Users className="h-4 w-4 text-blue-400" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">
                      Team Management
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Create and manage teams
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <Link
                      href="/admin/teams"
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-300">Manage Teams</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Users className="h-4 w-4 text-blue-400" />
                      </Button>
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <Link
                      href="/admin/teams/create"
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-300">Create New Team</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <UserPlus className="h-4 w-4 text-purple-400" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300 h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Calendar className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">
                      Schedule Management
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      View and manage schedules
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <Link
                      href="/admin/schedule"
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-300">View Schedules</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Calendar className="h-4 w-4 text-purple-400" />
                      </Button>
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <Link
                      href="/admin/schedule-editor"
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-300">Edit Schedule</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <FileText className="h-4 w-4 text-amber-400" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-3">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <BarChart3 className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">
                      Club Activity
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Weekly activity overview
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex justify-center">
                      <BarChart3 className="h-12 w-12 text-gray-500 mb-3" />
                    </div>
                    <p className="text-gray-400">Activity charts coming soon</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Analytics module in development
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
