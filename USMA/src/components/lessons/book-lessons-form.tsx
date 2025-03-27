'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { lessonService } from '../../services/lessonService';
import { userService } from '../../services/userService';
import { AlertCircle, CheckCircle, Calendar } from 'lucide-react';

interface Coach {
  id: string;
  first_name: string;
  last_name: string;
}

export default function BookLessonForm() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState('');
  const [lessonDate, setLessonDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCoaches, setIsLoadingCoaches] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch coaches from the API
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setIsLoadingCoaches(true);
        const result = await userService.getAllCoaches();

        if (result.error) {
          setError(result.error);
        } else {
          setCoaches(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        console.error('Error fetching coaches:', err);
        setError('Failed to load coaches');
      } finally {
        setIsLoadingCoaches(false);
      }
    };

    fetchCoaches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedCoach || !lessonDate || !startTime || !endTime) {
      setError('All fields are required');
      return;
    }

    // Validate time format and logic
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    setIsLoading(true);

    try {
      const result = await lessonService.bookLesson(
        selectedCoach,
        lessonDate,
        startTime,
        endTime
      );

      if (result.error) {
        setError(result.error);
      } else {
        const coach = coaches.find((c) => c.id === selectedCoach);
        const coachName = coach
          ? `${coach.first_name} ${coach.last_name}`
          : 'the selected coach';

        setSuccess(
          `Successfully booked a lesson with ${coachName} on ${lessonDate} from ${startTime} to ${endTime}`
        );
        // Reset form
        setSelectedCoach('');
        setLessonDate('');
        setStartTime('');
        setEndTime('');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error booking lesson:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Book a Private Lesson
        </CardTitle>
        <CardDescription className="text-gray-400">
          Schedule a one-on-one session with a coach
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 text-green-400 p-3 rounded-md text-sm mb-4 flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coach">Select Coach</Label>
            <Select
              value={selectedCoach}
              onValueChange={setSelectedCoach}
              disabled={isLoadingCoaches}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue
                  placeholder={
                    isLoadingCoaches ? 'Loading coaches...' : 'Choose a coach'
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {coaches.map((coach) => (
                  <SelectItem key={coach.id} value={coach.id}>
                    {coach.first_name} {coach.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lessonDate">Lesson Date</Label>
            <Input
              id="lessonDate"
              type="date"
              value={lessonDate}
              onChange={(e) => setLessonDate(e.target.value)}
              className="bg-gray-700 border-gray-600"
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500"
            disabled={isLoading || isLoadingCoaches}
          >
            {isLoading ? 'Booking...' : 'Book Lesson'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
