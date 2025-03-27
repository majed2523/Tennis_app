'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Avatar, AvatarFallback } from '../../../../components/ui/avatar';
import { Users, AlertCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../../../../services/authService';
import { teamService } from '../../../../services/teamService';

interface Player {
  id: string;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  role?: string;
}

interface Team {
  id: string;
  team_name: string;
  coach_id: string;
  coach_name?: string;
  players?: Player[];
  player_count?: number;
}

export default function TeamDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params?.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated and is a coach
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

    const fetchTeamDetails = async () => {
      try {
        setIsLoading(true);

        // Fetch team details
        const teamData = await teamService.getTeam(Number(teamId));

        if (teamData.error) {
          setError(teamData.error);
          return;
        }

        // Verify this coach is assigned to this team
        if (
          teamData.coach_id !== user.userId &&
          String(teamData.coach_id) !== user.userId &&
          Number(teamData.coach_id) !== Number(user.userId)
        ) {
          setError('You are not authorized to view this team');
          return;
        }

        setTeam(teamData);

        // Fetch team members
        const teamMembers = await teamService.getTeamMembers(teamId);

        if (!teamMembers.error) {
          setPlayers(teamMembers);
        }
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
  }, [teamId, router]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="bg-red-500/20 text-red-400 p-4 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push('/coach/teams')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
          </CardContent>
        </Card>
      ) : team ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/coach/teams')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {team.team_name}
              </h1>
              <p className="text-gray-400 mt-1">
                Coach: {userData?.firstName} {userData?.lastName}
              </p>
            </div>
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Users className="h-5 w-5 text-green-400 mr-2" />
                Team Members
              </CardTitle>
              <CardDescription>Players in this team</CardDescription>
            </CardHeader>
            <CardContent>
              {players.length > 0 ? (
                <div className="space-y-4">
                  {players.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="flex items-center p-3 bg-gray-700/30 rounded-md hover:bg-gray-700/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10 bg-green-600 text-white mr-4">
                        <AvatarFallback>
                          {(player.first_name || player.firstName || '').charAt(
                            0
                          )}
                          {(player.last_name || player.lastName || '').charAt(
                            0
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">
                          {player.first_name || player.firstName}{' '}
                          {player.last_name || player.lastName}
                        </p>
                        <p className="text-sm text-gray-400">
                          {player.role || 'Player'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 bg-gray-700/30 rounded-md">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                  <p>No players have been assigned to this team yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-400">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-500" />
              <p>Team not found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push('/coach/teams')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Teams
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
