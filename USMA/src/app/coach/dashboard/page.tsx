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
  Clock,
  Users,
  ChevronRight,
  BookOpen,
  CalendarDays,
  Megaphone,
} from 'lucide-react';
import Link from 'next/link';
import { authService } from '../../../services/authService';
import { lessonService } from '../../../services/lessonService';
import { teamService } from '../../../services/teamService';
import { coachService } from '../../../services/coachService';
import {
  announcementService,
  type Announcement,
} from '../../../services/announcementService';
import { Badge } from '../../../components/ui/badge';

export default function CoachDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [coachTeams, setCoachTeams] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const user = authService.getCurrentUser();
      if (!user || user.role !== 'coach') {
        router.push('/login');
        return;
      }

      setUserData(user);

      try {
        // Fetch coach's lessons
        const lessonsResponse = await lessonService.getCoachLessons(
          user.userId
        );
        if (!lessonsResponse.error) {
          // Sort lessons by date (upcoming first)
          const upcomingLessons = lessonsResponse
            .filter((lesson: any) => new Date(lesson.lesson_date) >= new Date())
            .sort(
              (a: any, b: any) =>
                new Date(a.lesson_date).getTime() -
                new Date(b.lesson_date).getTime()
            );

          setLessons(upcomingLessons);
        }

        // Fetch all teams
        const teamsResponse = await teamService.getAllTeams();
        if (!teamsResponse.error) {
          setTeams(teamsResponse);

          // Filter teams that the coach is assigned to
          const coachTeamsArray = teamsResponse.filter(
            (team: any) =>
              team.coach_id === user.userId ||
              (typeof team.coach_id === 'string' &&
                team.coach_id === user.userId) ||
              (typeof team.coach_id === 'number' &&
                team.coach_id === Number.parseInt(user.userId))
          );

          setCoachTeams(coachTeamsArray);
        }

        // Fetch coach's availability
        const availabilityResponse = await coachService.getAvailability(
          user.userId
        );
        if (!availabilityResponse.error) {
          // Sort availability by day of week
          const daysOrder = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ];
          const sortedAvailability = [...availabilityResponse].sort(
            (a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day)
          );

          setAvailability(sortedAvailability);
        }

        // Get announcements from localStorage
        const announcementsData = announcementService.getAllAnnouncements();

        // Sort by date (newest first) and importance
        const sortedAnnouncements = [...announcementsData].sort((a, b) => {
          // First sort by importance
          if (a.important && !b.important) return -1;
          if (!a.important && b.important) return 1;
          // Then by date
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setAnnouncements(sortedAnnouncements);
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
            Welcome, Coach{' '}
            <span className="text-green-500">{userData?.firstName}</span>!
          </h1>
          <p className="text-gray-400">
            Manage your lessons, teams, and availability from your dashboard.
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
            <Link href="/coach/lessons">
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
                <p className="text-2xl font-bold">{coachTeams.length || 0}</p>
              </div>
            </div>
            <Link href="/coach/teams">
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
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">My Availability</h3>
                <p className="text-2xl font-bold">{availability.length || 0}</p>
              </div>
            </div>
            <Link href="/coach/availability">
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-gray-700/50"
              >
                Manage Availability
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Megaphone className="mr-2 h-5 w-5 text-purple-500" />
                    <CardTitle className="text-white">Announcements</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/announcements/create">
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-500"
                      >
                        Create
                      </Button>
                    </Link>
                    <Link href="/announcements">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        View All
                      </Button>
                    </Link>
                  </div>
                </div>
                <CardDescription>
                  Latest club announcements and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.slice(0, 3).map((announcement, index) => (
                      <motion.div
                        key={announcement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors ${
                          announcement.important
                            ? 'border-l-4 border-l-amber-500'
                            : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white flex items-center">
                              {announcement.title}
                              {announcement.important && (
                                <Badge className="bg-amber-500/20 text-amber-400 ml-2">
                                  Important
                                </Badge>
                              )}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {announcement.content.length > 100
                                ? `${announcement.content.substring(0, 100)}...`
                                : announcement.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(
                                announcement.createdAt
                              ).toLocaleDateString()}{' '}
                              by {announcement.authorName}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No announcements available</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-gray-700 pt-4">
                <Link href="/announcements" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Announcements
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

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
                  Your scheduled private lessons with players
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lessons.length > 0 ? (
                  <div className="space-y-4">
                    {lessons.slice(0, 3).map((lesson, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              Lesson with {lesson.player_name || 'Player'}
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
                      Set your availability to allow bookings
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-gray-700 pt-4">
                <Link href="/coach/lessons" className="w-full">
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
                <CardDescription>Teams you're coaching</CardDescription>
              </CardHeader>
              <CardContent>
                {coachTeams.length > 0 ? (
                  <div className="space-y-4">
                    {coachTeams.slice(0, 5).map((team, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{team.team_name}</h4>
                            <p className="text-sm text-gray-400">
                              {team.player_count || 0}{' '}
                              {team.player_count === 1 ? 'Member' : 'Members'}
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
                    <p>No teams assigned</p>
                    <p className="text-sm mt-1">
                      You haven't been assigned to any teams yet
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-gray-700 pt-4">
                <Link href="/coach/teams" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Teams
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* My Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5 text-purple-500" />
                  My Availability
                </CardTitle>
                <CardDescription>
                  Your current coaching availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                {availability.length > 0 ? (
                  <div className="space-y-4">
                    {availability.slice(0, 5).map((slot, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{slot.day}</h4>
                            <p className="text-sm text-gray-400">
                              {slot.start_time} - {slot.end_time}
                            </p>
                          </div>
                          <div className="bg-purple-500/20 text-purple-500 text-xs px-2 py-1 rounded-full">
                            Available
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No availability set</p>
                    <p className="text-sm mt-1">
                      Add your coaching hours to receive bookings
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-gray-700 pt-4">
                <Link href="/coach/availability" className="w-full">
                  <Button variant="outline" className="w-full">
                    Manage Availability
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
