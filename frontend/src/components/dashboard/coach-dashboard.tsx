'use client';

import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Calendar, Users, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { coachService } from '../../services/coachService';
import { lessonService } from '../../services/lessonService';
import { authService } from '../../services/authService';

export default function CoachDashboard() {
  const [stats, setStats] = useState({
    totalLessons: 0,
    upcomingLessons: 0,
    assignedTeams: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const user = authService.getCurrentUser();
      if (!user?.userId) return;

      const [lessons, availability] = await Promise.all([
        lessonService.getCoachLessons(user.userId),
        coachService.getAvailability(user.userId),
      ]);

      setStats({
        totalLessons: lessons.length || 0,
        upcomingLessons:
          lessons.filter((l: any) => new Date(l.date) > new Date()).length || 0,
        assignedTeams: 0, // This would come from a teams endpoint
      });
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'My Schedule',
      description: 'View and manage your schedule',
      icon: <Calendar className="h-6 w-6 text-green-400" />,
      link: '/coach/schedule',
      stats: `${stats.upcomingLessons} Upcoming Lessons`,
    },
    {
      title: 'My Teams',
      description: 'View assigned teams',
      icon: <Users className="h-6 w-6 text-blue-400" />,
      link: '/coach/teams',
      stats: `${stats.assignedTeams} Teams`,
    },
    {
      title: 'Availability',
      description: 'Set your availability',
      icon: <Clock className="h-6 w-6 text-purple-400" />,
      link: '/coach/availability',
      stats: 'Manage Hours',
    },
    {
      title: 'Lesson History',
      description: 'View past lessons',
      icon: <BookOpen className="h-6 w-6 text-orange-400" />,
      link: '/coach/lessons',
      stats: `${stats.totalLessons} Total Lessons`,
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
        <h1 className="text-4xl font-bold text-white mb-2">Coach Dashboard</h1>
        <p className="text-gray-400">Manage your lessons and teams</p>
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
