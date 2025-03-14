'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { AlertCircle, Users, ArrowLeft, UserPlus, Trash2 } from 'lucide-react';
import { teamService } from '../../services/teamService';

interface Player {
  id: string;
  first_name: string;
  last_name: string;
  role?: string;
}

interface TeamDetailsProps {
  teamId: string;
  onBack: () => void;
}

export default function TeamDetails({ teamId, onBack }: TeamDetailsProps) {
  const [team, setTeam] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const fetchTeamDetails = async () => {
    try {
      setIsLoading(true);
      const teamData = await teamService.getTeam(Number(teamId));

      if (teamData.error) {
        setError(teamData.error);
        return;
      }

      setTeam(teamData);
    } catch (err) {
      console.error('Error fetching team details:', err);
      setError('Failed to load team details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamPlayers = async () => {
    try {
      setIsLoadingPlayers(true);
      const result = await teamService.getTeamMembers(teamId);

      if (result.error) {
        setPlayerError(result.error);
      } else {
        setPlayers(Array.isArray(result) ? result : []);
      }
    } catch (err) {
      console.error('Error fetching team players:', err);
      setPlayerError('Failed to load team players');
    } finally {
      setIsLoadingPlayers(false);
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    try {
      const result = await teamService.removePlayerFromTeam(teamId, playerId);

      if (result.error) {
        setPlayerError(result.error);
      } else {
        // Refresh the player list
        fetchTeamPlayers();
      }
    } catch (err) {
      console.error('Error removing player:', err);
      setPlayerError('Failed to remove player from team');
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
      fetchTeamPlayers();
    }
  }, [teamId]);

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

  if (error || !team) {
    return (
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="bg-red-500/20 text-red-400 p-4 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error || 'Team not found'}</p>
          </div>
          <Button variant="outline" className="mt-4" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-green-400 flex items-center gap-2">
              <Users className="h-5 w-5" />
              {team.team_name}
            </CardTitle>
            <CardDescription className="text-gray-400 mt-1">
              Coach: {team.coach_name || 'Unassigned'}
            </CardDescription>
          </div>
          <Badge className="bg-green-400/20 text-green-400">
            {players.length} Players
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>

        {playerError && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <p>{playerError}</p>
          </div>
        )}

        {isLoadingPlayers ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></div>
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-gray-700/30 rounded-md">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-500" />
            <p>No players have been assigned to this team yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-md hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 bg-green-600 text-white">
                    <AvatarFallback>
                      {player.first_name.charAt(0)}
                      {player.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-medium text-white">
                      {player.first_name} {player.last_name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {player.role || 'Player'}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={() => handleRemovePlayer(player.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove player</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
        <Button variant="outline" onClick={onBack} className="text-gray-300">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Teams
        </Button>

        <Button
          className="bg-green-600 hover:bg-green-500"
          onClick={() => {
            onBack();
            // This will show the assign player form when returning to the teams list
          }}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Player
        </Button>
      </CardFooter>
    </Card>
  );
}
