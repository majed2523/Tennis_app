'use client';

import React, { useState, useEffect } from 'react';
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
import { teamService } from '../../services/teamService';
import { userService } from '../../services/userService';
import { AlertCircle, CheckCircle, Users } from 'lucide-react';

interface Coach {
  id: number; // Numeric ID
  first_name: string;
  last_name: string;
}

export default function CreateTeamForm() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [teamName, setTeamName] = useState('');
  /**
   * We'll store the selected coach ID as a string so Radix Select works properly.
   * Then we'll parse it back to a number when creating the team.
   */
  const [selectedCoach, setSelectedCoach] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCoaches, setIsLoadingCoaches] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setIsLoadingCoaches(true);
        const result = await userService.getAllCoaches();
        // Must be an array on success
        if (Array.isArray(result)) {
          setCoaches(result);
        } else {
          setError('Unexpected response while fetching coaches.');
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

    if (!teamName || !selectedCoach) {
      setError('All fields are required');
      return;
    }

    setIsLoading(true);

    try {
      // Convert the string back to a numeric ID for your backend
      const numericCoachId = parseInt(selectedCoach, 10);

      // Example: Suppose teamService.createTeam returns { success: boolean }
      const result = await teamService.createTeam(teamName, numericCoachId);

      if (result.success) {
        // Display the coach's name in success message
        const coach = coaches.find((c) => c.id === numericCoachId);
        const coachName = coach
          ? `${coach.first_name} ${coach.last_name}`
          : 'the selected coach';

        setSuccess(
          `Successfully created team "${teamName}" with ${coachName} as coach`
        );
        // Reset form
        setTeamName('');
        setSelectedCoach('');
      } else {
        setError('Failed to create team');
      }
    } catch (err) {
      console.error('Error creating team:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Create New Team
        </CardTitle>
        <CardDescription className="text-gray-600">
          Form a new team and assign a coach
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-md text-sm mb-4 flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Name Field */}
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="bg-gray-100 border border-gray-300"
              placeholder="Enter team name"
              required
            />
          </div>

          {/* Assign Coach Field */}
          <div className="space-y-2">
            <Label htmlFor="coach">Assign Coach</Label>
            <Select
              // The select is storing a numeric ID as a string
              value={selectedCoach}
              onValueChange={(value) => {
                console.log('Selected coach:', value);
                setSelectedCoach(value);
              }}
              disabled={isLoadingCoaches}
            >
              <SelectTrigger
                id="coach"
                className="bg-gray-100 border border-gray-300 w-full"
              >
                <SelectValue
                  placeholder={
                    isLoadingCoaches ? 'Loading coaches...' : 'Select a coach'
                  }
                  className="text-gray-900"
                />
              </SelectTrigger>

              <SelectContent className="bg-white border border-gray-200">
                {coaches.map((coach) => (
                  <SelectItem
                    // Convert numeric ID to string
                    key={coach.id}
                    value={String(coach.id)}
                    className="
                      hover:bg-red-50 
                      data-[state=active]:bg-red-50 
                      data-[state=checked]:bg-red-50 
                      data-[state=checked]:text-red-600
                    "
                  >
                    {coach.first_name} {coach.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading || isLoadingCoaches}
          >
            {isLoading ? 'Creating...' : 'Create Team'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
