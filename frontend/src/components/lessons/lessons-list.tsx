'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { lessonService, authService } from '../../services/api';
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';

interface Lesson {
  id: string;
  coach_id: string;
  player_id: string;
  coach_name?: string;
  player_name?: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
}

export default function LessonsList({
  role = 'player',
}: {
  role?: 'player' | 'coach';
}) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const userData = authService.getCurrentUser();
        if (!userData) {
          setError('User not authenticated');
          setIsLoading(false);
          return;
        }

        let result;
        if (role === 'coach') {
          result = await lessonService.getCoachLessons(userData.userId);
        } else {
          result = await lessonService.getPlayerLessons(userData.userId);
        }

        if (result.error) {
          setError(result.error);
        } else {
          setLessons(result);
        }
      } catch (err) {
        console.error('Error fetching lessons:', err);
        setError('Failed to load lessons');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [role]);

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

  // Format time from 24h to 12h format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = Number.parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="bg-red-500/20 text-red-400 p-4 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {role === 'coach' ? 'Your Coaching Schedule' : 'Your Lessons'}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {role === 'coach'
            ? 'Upcoming lessons with your students'
            : 'Your scheduled private lessons with coaches'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {lessons.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-500" />
            <p>No lessons scheduled yet.</p>
            <p className="text-sm mt-1">
              {role === 'coach'
                ? 'Your booked lessons will appear here.'
                : 'Book a lesson to get started with a coach.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-gray-700/50 p-4 rounded-md border-l-4 border-green-400"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white">
                    {formatDate(lesson.lesson_date)}
                  </h3>
                  <Badge className="bg-green-400/20 text-green-400">
                    Confirmed
                  </Badge>
                </div>

                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-green-400 mr-2" />
                    <span>
                      {formatTime(lesson.start_time)} -{' '}
                      {formatTime(lesson.end_time)}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <User className="h-4 w-4 text-green-400 mr-2" />
                    <span>
                      {role === 'coach'
                        ? `Student: ${lesson.player_name || 'Unknown Player'}`
                        : `Coach: ${lesson.coach_name || 'Unknown Coach'}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
