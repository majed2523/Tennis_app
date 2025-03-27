'use client';

import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Calendar, Users, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { lessonService } from '../../services/lessonService';
import { authService } from '../../services/authService';

export default function PlayerDashboard() {
  const [stats, setStats] = useState({
    totalLessons: 0,
    upcomingLessons: 0,
    teams: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const user = authService.getCurrentUser();
      if (!user?.userId) return;

      const lessons = await lessonService.getPlayerLessons(user.userId);

      setStats({
        totalLessons: lessons.length || 0,
        upcomingLessons:
          lessons.filter((l: any) => new Date(l.date) > new Date()).length || 0,
        teams: 0, // This would come from a teams endpoint
      });
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Book a Lesson',
      description: 'Schedule private lessons',
      icon: <Calendar className="h-6 w-6 text-green-400" />,
      link: '/player/book-lesson',
      stats: `${stats.upcomingLessons} Upcoming Lessons`,
    },
    {
      title: 'My Teams',
      description: 'View your team memberships',
      icon: <Users className="h-6 w-6 text-blue-400" />,
      link: '/player/teams',
      stats: `${stats.teams} Teams`,
    },
    {
      title: 'Schedule',
      description: 'View court schedule',
      icon: <Clock className="h-6 w-6 text-purple-400" />,
      link: '/schedule',
      stats: 'View Schedule',
    },
    {
      title: 'Lesson History',
      description: 'View your past lessons',
      icon: <BookOpen className="h-6 w-6 text-orange-400" />,
      link: '/player/lessons',
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
        <h1 className="text-4xl font-bold text-white mb-2">Player Dashboard</h1>
        <p className="text-gray-400">Manage your tennis activities</p>
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
