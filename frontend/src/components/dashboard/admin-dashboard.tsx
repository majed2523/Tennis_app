'use client';

import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Users, Calendar, UserPlus, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { userService} from '../../services/userService';
import { teamService } from '../../services/teamService';
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalCoaches: 0,
    totalTeams: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [players, coaches, teams] = await Promise.all([
        userService.getAllPlayers(),
        userService.getAllCoaches(),
        teamService.getAllTeams(),
      ]);

      setStats({
        totalPlayers: players.length || 0,
        totalCoaches: coaches.length || 0,
        totalTeams: teams.length || 0,
      });
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'User Management',
      description: 'Register and manage users',
      icon: <UserPlus className="h-6 w-6 text-green-400" />,
      link: '/admin/register',
      stats: `${stats.totalPlayers} Players • ${stats.totalCoaches} Coaches`,
    },
    {
      title: 'Team Management',
      description: 'Create and manage teams',
      icon: <Users className="h-6 w-6 text-blue-400" />,
      link: '/admin/teams',
      stats: `${stats.totalTeams} Teams`,
    },
    {
      title: 'Schedule Management',
      description: 'Manage court schedules',
      icon: <Calendar className="h-6 w-6 text-purple-400" />,
      link: '/admin/schedule',
      stats: 'View & Edit Schedule',
    },
    {
      title: 'Activity Log',
      description: 'Monitor system activity',
      icon: <ClipboardList className="h-6 w-6 text-orange-400" />,
      link: '/admin/activity',
      stats: 'View Recent Activity',
    },
  ];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage your tennis club</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={card.link}>
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-green-500/50 transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {card.icon}
                    <span className="text-xs text-gray-400">
                      View Details →
                    </span>
                  </div>
                  <CardTitle className="text-white">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">{card.stats}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
