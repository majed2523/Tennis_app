'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Calendar,
  Users,
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Bell,
  Megaphone,
} from 'lucide-react';
import Link from 'next/link';
import { authService } from '../../services/authService';
import { lessonService } from '../../services/lessonService';
import { teamService } from '../../services/teamService';
import { Badge } from '../../components/ui/badge';
import { useRouter } from 'next/navigation';
import {
  announcementService,
  type Announcement,
} from '../../services/announcementService';

export default function PlayerDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [playerTeams, setPlayerTeams] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPracticeHours, setTotalPracticeHours] = useState(0);
  const [notifications, setNotifications] = useState<
    {
      id: number;
      message: string;
      time: string;
      type: 'reminder' | 'update' | 'event';
    }[]
  >([]);

  const router = useRouter();

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
          const upcomingLessons = lessonsResponse
            .filter((lesson: any) => new Date(lesson.lesson_date) >= new Date())
            .sort(
              (a: any, b: any) =>
                new Date(a.lesson_date).getTime() -
                new Date(b.lesson_date).getTime()
            );

          setLessons(upcomingLessons);

          // Calculate total practice hours
          const totalHours = lessonsResponse.reduce(
            (total: number, lesson: any) => {
              const startTime = new Date(`2000-01-01T${lesson.start_time}:00`);
              const endTime = new Date(`2000-01-01T${lesson.end_time}:00`);
              const durationHours =
                (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
              return total + durationHours;
            },
            0
          );

          setTotalPracticeHours(Math.round(totalHours));

          // Generate notifications for upcoming lessons
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);

          const dayAfterTomorrow = new Date(tomorrow);
          dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

          const tomorrowLessons = upcomingLessons.filter((lesson: any) => {
            const lessonDate = new Date(lesson.lesson_date);
            return lessonDate >= tomorrow && lessonDate < dayAfterTomorrow;
          });

          const lessonNotifications = tomorrowLessons.map(
            (lesson: any, index: number) => ({
              id: 200 + index,
              message: `Your lesson with ${
                lesson.coach_name || 'Coach'
              } is tomorrow at ${lesson.start_time}`,
              time: 'Today',
              type: 'reminder' as const,
            })
          );

          // Fetch all teams
          const teamsResponse = await teamService.getAllTeams();
          if (!teamsResponse.error) {
            setTeams(teamsResponse);

            // Filter teams that the player is a member of
            const playerTeamsArray = [];
            for (const team of teamsResponse) {
              try {
                const teamMembers = await teamService.getTeamMembers(
                  team.id.toString()
                );
                if (
                  !teamMembers.error &&
                  teamMembers.some(
                    (member: any) =>
                      member.id === Number(user.userId) ||
                      member.id === user.userId
                  )
                ) {
                  playerTeamsArray.push(team);
                }
              } catch (error) {
                console.error(
                  `Error fetching members for team ${team.id}:`,
                  error
                );
              }
            }
            setPlayerTeams(playerTeamsArray);

            // Generate notifications for upcoming team practices
            const teamNotifications = playerTeamsArray
              .slice(0, 1)
              .map((team, index) => ({
                id: 300 + index,
                message: `Team practice for ${team.team_name} scheduled for this week`,
                time: '2 days ago',
                type: 'event' as const,
              }));

            // Fetch announcements from localStorage
            const storedAnnouncements =
              announcementService.getAllAnnouncements();

            // Sort by date (newest first) and importance
            const sortedAnnouncements = [...storedAnnouncements].sort(
              (a, b) => {
                // First sort by importance
                if (a.important && !b.important) return -1;
                if (!a.important && b.important) return 1;
                // Then by date
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              }
            );

            setAnnouncements(sortedAnnouncements);

            // Create notifications from important announcements
            const announcementNotifications = sortedAnnouncements
              .filter((a) => a.important)
              .slice(0, 2)
              .map((a, index) => ({
                id: 100 + index,
                message: a.title,
                time: getTimeAgo(new Date(a.createdAt)),
                type: 'update' as const,
              }));

            // Combine all notifications and limit to 4
            setNotifications(
              [
                ...lessonNotifications,
                ...announcementNotifications,
                ...teamNotifications,
              ].slice(0, 4)
            );
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Helper function to format time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60)
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-club-red/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-club-red rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 p-6 md:p-8 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-club-red/20 via-club-red/10 to-gray-100 rounded-xl"></div>
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl"></div>

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
                  <Button className="bg-club-red hover:bg-club-dark-red text-white">
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
                    <div className="w-12 h-12 rounded-full bg-club-red/10 flex items-center justify-center mr-4">
                      <Calendar className="h-6 w-6 text-club-red" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Upcoming Lessons</p>
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
                    <div className="w-12 h-12 rounded-full bg-club-red/10 flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-club-red" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">My Teams</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {playerTeams.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-club-red/10 flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-club-red" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Practice Hours</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {totalPracticeHours}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Announcements */}
            <motion.div variants={item}>
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Megaphone className="mr-2 h-5 w-5 text-club-red" />
                      <CardTitle className="text-gray-800">
                        Announcements
                      </CardTitle>
                    </div>
                    <Link href="/announcements">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-800"
                      >
                        View All
                      </Button>
                    </Link>
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
                          className={`bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors ${
                            announcement.important
                              ? 'border-l-4 border-l-club-red'
                              : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800 flex items-center">
                                {announcement.title}
                                {announcement.important && (
                                  <Badge className="bg-club-red/10 text-club-red ml-2">
                                    Important
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {announcement.content.length > 100
                                  ? `${announcement.content.substring(
                                      0,
                                      100
                                    )}...`
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
                <CardFooter className="border-t border-gray-200 pt-4">
                  <Link href="/announcements" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-club-red text-club-red hover:bg-club-red/5"
                    >
                      View All Announcements
                    </Button>
                  </Link>
                </CardFooter>
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
                        className="text-gray-500 hover:text-gray-800"
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
                      {lessons.slice(0, 3).map((lesson, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">
                                Lesson with {lesson.coach_name || 'Coach'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {new Date(
                                  lesson.lesson_date
                                ).toLocaleDateString()}{' '}
                                • {lesson.start_time} - {lesson.end_time}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Court {lesson.court || 1}
                              </p>
                            </div>
                            <div className="bg-club-red/10 text-club-red text-xs px-2 py-1 rounded-full">
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
                <CardFooter className="border-t border-gray-200 pt-4">
                  <Link href="/player/lessons" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-club-red text-club-red hover:bg-club-red/5"
                    >
                      Book a Lesson
                    </Button>
                  </Link>
                </CardFooter>
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
                    <Link href="/player/teams">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-800"
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
                  {playerTeams.length > 0 ? (
                    <div className="space-y-4">
                      {playerTeams.map((team, index) => (
                        <motion.div
                          key={team.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {team.team_name || `Team ${index + 1}`}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Coach: {team.coach_name || 'Assigned Coach'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Level: {team.level || 'Intermediate'} •{' '}
                                {team.practice_day || 'Monday'},{' '}
                                {team.practice_time || '5:00 PM'}
                              </p>
                            </div>
                            <div className="bg-club-red/10 text-club-red text-xs px-2 py-1 rounded-full">
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
                <CardFooter className="border-t border-gray-200 pt-4">
                  <Link href="/player/teams" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-club-red text-club-red hover:bg-club-red/5"
                    >
                      View All Teams
                    </Button>
                  </Link>
                </CardFooter>
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
                  {notifications.length > 0 ? (
                    <div className="space-y-4">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 p-1.5 rounded-full 
                              ${
                                notification.type === 'reminder'
                                  ? 'bg-club-red/10'
                                  : notification.type === 'update'
                                  ? 'bg-club-red/10'
                                  : 'bg-club-red/10'
                              }`}
                            >
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
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-gray-200 pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-club-red text-club-red hover:bg-club-red/5"
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
                        <span className="text-sm text-gray-600">Forehand</span>
                        <span className="text-sm text-gray-600">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-club-red h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Backhand</span>
                        <span className="text-sm text-gray-600">60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-club-red h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '60%' }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Serve</span>
                        <span className="text-sm text-gray-600">80%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-club-red h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '80%' }}
                          transition={{ duration: 1, delay: 0.4 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Volley</span>
                        <span className="text-sm text-gray-600">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-club-red h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '45%' }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-200 pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-club-red text-club-red hover:bg-club-red/5"
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
