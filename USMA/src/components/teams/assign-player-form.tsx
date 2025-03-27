'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
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
import { Label } from '../ui/label';
import { AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { userService } from '../../services/userService';
import { teamService } from '../../services/teamService';

interface Player {
  id: string;
  first_name: string;
  last_name: string;
}

interface Team {
  id: string;
  team_name: string;
}

interface AssignPlayerFormProps {
  teams: Team[];
  onPlayerAssigned?: () => void;
}

export default function AssignPlayerForm({
  teams,
  onPlayerAssigned,
}: AssignPlayerFormProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoadingPlayers(true);
        const result = await userService.getAllPlayers();

        if (result.error) {
          setError(result.error);
        } else {
          setPlayers(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('Failed to load players');
      } finally {
        setIsLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedPlayer || !selectedTeam) {
      setError('Please select both a player and a team');
      return;
    }

    setIsLoading(true);

    try {
      const result = await teamService.assignPlayerToTeam(
        selectedTeam,
        selectedPlayer
      );

      if (result.error) {
        setError(result.error);
      } else {
        const player = players.find((p) => p.id === selectedPlayer);
        const team = teams.find((t) => t.id === selectedTeam);

        if (player && team) {
          setSuccess(
            `Successfully assigned ${player.first_name} ${player.last_name} to team "${team.team_name}"`
          );

          // Reset form
          setSelectedPlayer('');
          setSelectedTeam('');

          // Notify parent component
          if (onPlayerAssigned) {
            onPlayerAssigned();
          }
        }
      }
    } catch (err) {
      console.error('Error assigning player:', err);
      setError('Failed to assign player to team. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-green-400 flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Assign Player to Team
        </CardTitle>
        <CardDescription className="text-gray-400">
          Add players to existing teams
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert
            variant="destructive"
            className="mb-4 bg-red-500/10 border-red-500/20 text-red-400"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-500/10 border-green-500/20 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="player">Select Player</Label>
            <Select
              value={selectedPlayer}
              onValueChange={setSelectedPlayer}
              disabled={isLoadingPlayers}
            >
              <SelectTrigger
                id="player"
                className="bg-gray-700 border-gray-600"
              >
                <SelectValue
                  placeholder={
                    isLoadingPlayers ? 'Loading players...' : 'Select a player'
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.first_name} {player.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">Select Team</Label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger id="team" className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.team_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500"
            disabled={isLoading || isLoadingPlayers}
          >
            {isLoading ? 'Assigning...' : 'Assign Player'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
