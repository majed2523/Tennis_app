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

interface Team {
  id: string;
  team_name: string;
  coach_name?: string;
  players?: Player[];
  player_count?: number;
}

interface TeamDetailsProps {
  teamId: string;
  onBack: () => void;
}

export default function TeamDetails({ teamId, onBack }: TeamDetailsProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setIsLoading(true);
        const teamData = await teamService.getTeam(Number(teamId));

        if (teamData.error) {
          setError(teamData.error);
          return;
        }

        console.log('🔹 Updating UI with team:', teamData); // Debugging
        setTeam(teamData);
      } catch (err) {
        console.error('Error fetching team details:', err);
        setError('Failed to load team details');
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchTeamDetails();
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
            {team.player_count ?? 0} Players
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>

        {team.players?.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-gray-700/30 rounded-md">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-500" />
            <p>No players have been assigned to this team yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {team.players?.map((player) => (
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
      </CardFooter>
    </Card>
  );
}
