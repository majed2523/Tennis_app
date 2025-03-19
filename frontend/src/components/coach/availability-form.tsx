'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { coachService } from '../../services/coachService';
import { authService } from '../../services/authService';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function AvailabilityForm() {
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!day || !startTime || !endTime) {
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
      const userData = authService.getCurrentUser();
      if (!userData || userData.role !== 'coach') {
        setError('Only coaches can set availability');
        setIsLoading(false);
        return;
      }

      const result = await coachService.addAvailability(
        userData.userId,
        day,
        startTime,
        endTime
      );

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(
          `Successfully added availability for ${day} from ${startTime} to ${endTime}`
        );
        // Reset form
        setDay('');
        setStartTime('');
        setEndTime('');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error setting availability:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Set Your Availability
        </CardTitle>
        <CardDescription className="text-gray-400">
          Add times when you're available to coach
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
            <Label htmlFor="day">Day of Week</Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Add Availability'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
