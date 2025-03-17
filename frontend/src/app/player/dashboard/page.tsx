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
import { Calendar, Award, ChevronRight, Users, BookOpen } from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome,{' '}
            <span className="text-green-500">{userData?.firstName}</span>!
          </h1>
          <p className="text-gray-400">
            Here's an overview of your tennis activities and upcoming lessons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Upcoming Lessons</h3>
                <p className="text-2xl font-bold">{lessons.length || 0}</p>
              </div>
            </div>
            <Link href="/player/lessons">
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-gray-700/50"
              >
                View All Lessons
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">My Teams</h3>
                <p className="text-2xl font-bold">{teams.length || 0}</p>
              </div>
            </div>
            <Link href="/teams">
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-gray-700/50"
              >
                View My Teams
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Club Schedule</h3>
                <p className="text-sm text-gray-400">View upcoming events</p>
              </div>
            </div>
            <Link href="/schedule">
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-gray-700/50"
              >
                View Schedule
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Lessons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-green-500" />
                  Upcoming Lessons
                </CardTitle>
                <CardDescription>
                  Your scheduled private lessons with coaches
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lessons.length > 0 ? (
                  <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              Lesson with {lesson.coach_name || 'Coach'}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {new Date(
                                lesson.lesson_date
                              ).toLocaleDateString()}{' '}
                              • {lesson.start_time} - {lesson.end_time}
                            </p>
                          </div>
                          <div className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">
                            Confirmed
                          </div>
                        </div>
                      </div>
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
              <CardFooter className="border-t border-gray-700 pt-4">
                <Link href="/player/lessons" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Lessons
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* My Teams */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-500" />
                  My Teams
                </CardTitle>
                <CardDescription>
                  Teams you're currently part of
                </CardDescription>
              </CardHeader>
              <CardContent>
                {teams.length > 0 ? (
                  <div className="space-y-4">
                    {teams.map((team, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {team.team_name || `Team ${index + 1}`}
                            </h4>
                            <p className="text-sm text-gray-400">
                              Coach: {team.coach_name || 'Assigned Coach'}
                            </p>
                          </div>
                          <div className="bg-blue-500/20 text-blue-500 text-xs px-2 py-1 rounded-full">
                            Active
                          </div>
                        </div>
                      </div>
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
              <CardFooter className="border-t border-gray-700 pt-4">
                <Link href="/teams" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Teams
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
