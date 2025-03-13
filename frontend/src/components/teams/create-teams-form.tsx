'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
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
import { teamService } from '../../services/api';
import { AlertCircle, CheckCircle, Users } from 'lucide-react';

interface Coach {
  id: string;
  firstName: string;
  lastName: string;
}

// Mock coaches data - in a real app, you would fetch this from the API
const MOCK_COACHES: Coach[] = [
  { id: '1', firstName: 'John', lastName: 'Davis' },
  { id: '2', firstName: 'Sarah', lastName: 'Miller' },
  { id: '3', firstName: 'Michael', lastName: 'Chen' },
];

export default function CreateTeamForm() {
  const [coaches, setCoaches] = useState<Coach[]>(MOCK_COACHES);
  const [teamName, setTeamName] = useState('');
  const [selectedCoach, setSelectedCoach] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // In a real app, you would fetch coaches from the API
  useEffect(() => {
    // Fetch coaches logic would go here
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
      const result = await teamService.createTeam(teamName, selectedCoach);

      if (result.error) {
        setError(result.error);
      } else {
        const coach = coaches.find((c) => c.id === selectedCoach);
        const coachName = coach
          ? `${coach.firstName} ${coach.lastName}`
          : 'the selected coach';

        setSuccess(
          `Successfully created team "${teamName}" with ${coachName} as coach`
        );
        // Reset form
        setTeamName('');
        setSelectedCoach('');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error creating team:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Create New Team
        </CardTitle>
        <CardDescription className="text-gray-400">
          Form a new team and assign a coach
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
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="bg-gray-700 border-gray-600"
              placeholder="Enter team name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coach">Assign Coach</Label>
            <Select value={selectedCoach} onValueChange={setSelectedCoach}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select a coach" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {coaches.map((coach) => (
                  <SelectItem key={coach.id} value={coach.id}>
                    {coach.firstName} {coach.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Team'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
