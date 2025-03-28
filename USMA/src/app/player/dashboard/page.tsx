'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import {
  Calendar,
  Users,
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { authService } from '../../../services/authService';
import { lessonService } from '../../../services/lessonService';
import { teamService } from '../../../services/teamService';

export default function PlayerDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'Your lesson with Coach Mike is tomorrow at 3:00 PM',
      time: '1 hour ago',
      type: 'reminder',
    },
    {
      id: 2,
      message: 'New team practice schedule has been posted',
      time: '3 hours ago',
      type: 'update',
    },
    {
      id: 3,
      message: 'Tournament registration opens next week',
      time: '1 day ago',
      type: 'event',
    },
  ]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const user = authService.getCurrentUser();
      if (!user || user.role !== 'player') {
        router.push('/login');
        return;
      }

      setUserData(user);

      try {
        // Fetch player's lessons
        const lessonsResponse = await lessonService.getPlayerLessons(
          user.userId
        );
        if (!lessonsResponse.error) {
          setLessons(lessonsResponse.slice(0, 3)); // Show only the first 3 lessons
        }

        // Fetch teams (in a real app, you'd fetch only the player's teams)
        const teamsResponse = await teamService.getAllTeams();
        if (!teamsResponse.error) {
          setTeams(teamsResponse.slice(0, 3)); // Show only the first 3 teams
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-club-red/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-club-red rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 p-6 md:p-8 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-club-red/20 via-gray-400/20 to-gray-500/20 rounded-xl"></div>
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 rounded-xl"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Welcome,{' '}
                  <span className="text-club-red">{userData?.firstName}</span>!
                </h1>
                <p className="text-gray-600 mt-2">
                  Here's an overview of your tennis activities and upcoming
                  lessons.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link href="/schedule">
                  <Button className="bg-club-red hover:bg-club-red/90 text-white">
                    View Club Schedule
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 space-y-6"
          >
            {/* Quick Stats */}
            <motion.div
              variants={item}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-club-red/20 flex items-center justify-center mr-4">
                      <Calendar className="h-6 w-6 text-club-red" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Upcoming Lessons</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {lessons.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-club-red/20 flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-club-red" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">My Teams</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {teams.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-club-red/20 flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-club-red" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Practice Hours</p>
                      <p className="text-2xl font-bold text-gray-800">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Lessons */}
            <motion.div variants={item}>
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-club-red" />
                      <CardTitle className="text-gray-800">
                        Upcoming Lessons
                      </CardTitle>
                    </div>
                    <Link href="/player/lessons">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-800"
                      >
                        View All
                      </Button>
                    </Link>
                  </div>
                  <CardDescription>
                    Your scheduled private lessons with coaches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {lessons.length > 0 ? (
                    <div className="space-y-4">
                      {lessons.map((lesson, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">
                                Lesson with {lesson.coach_name || 'Coach'}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {new Date(
                                  lesson.lesson_date
                                ).toLocaleDateString()}{' '}
                                • {lesson.start_time} - {lesson.end_time}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Court {lesson.court || 1}
                              </p>
                            </div>
                            <div className="bg-club-red/20 text-club-red text-xs px-2 py-1 rounded-full">
                              Confirmed
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No upcoming lessons</p>
                      <p className="text-sm mt-1">
                        Book a lesson with one of our coaches
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* My Teams */}
            <motion.div variants={item}>
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-club-red" />
                      <CardTitle className="text-gray-800">My Teams</CardTitle>
                    </div>
                    <Link href="/teams">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-800"
                      >
                        View All
                      </Button>
                    </Link>
                  </div>
                  <CardDescription>
                    Teams you're currently part of
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {teams.length > 0 ? (
                    <div className="space-y-4">
                      {teams.map((team, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {team.team_name || `Team ${index + 1}`}
                              </h4>
                              <p className="text-sm text-gray-400">
                                Coach: {team.coach_name || 'Assigned Coach'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Next practice: Friday, 5:00 PM
                              </p>
                            </div>
                            <div className="bg-club-red/20 text-club-red text-xs px-2 py-1 rounded-full">
                              Active
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>You're not part of any teams yet</p>
                      <p className="text-sm mt-1">
                        Contact an admin to join a team
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-1 space-y-6"
          >
            {/* Notifications */}
            <motion.div variants={item}>
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-club-red" />
                    <CardTitle className="text-gray-800">
                      Notifications
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Recent updates and reminders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-1.5 rounded-full bg-club-red/20">
                            {notification.type === 'reminder' ? (
                              <Clock className="h-3.5 w-3.5 text-club-red" />
                            ) : notification.type === 'update' ? (
                              <TrendingUp className="h-3.5 w-3.5 text-club-red" />
                            ) : (
                              <Trophy className="h-3.5 w-3.5 text-club-red" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-800">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-200 pt-4">
                  <Button
                    variant="outline"
                    className="w-full text-gray-400 hover:text-gray-800"
                  >
                    View All Notifications
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Progress Card */}
            <motion.div variants={item}>
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-club-red" />
                    <CardTitle className="text-gray-800">
                      Your Progress
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Track your tennis improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Forehand</span>
                        <span className="text-sm text-gray-400">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-club-red h-2 rounded-full"
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Backhand</span>
                        <span className="text-sm text-gray-400">60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-club-red h-2 rounded-full"
                          style={{ width: '60%' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Serve</span>
                        <span className="text-sm text-gray-400">80%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-club-red h-2 rounded-full"
                          style={{ width: '80%' }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-400">Volley</span>
                        <span className="text-sm text-gray-400">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-club-red h-2 rounded-full"
                          style={{ width: '45%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-200 pt-4">
                  <Button
                    variant="outline"
                    className="w-full text-gray-400 hover:text-gray-800"
                  >
                    View Full Progress Report
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
