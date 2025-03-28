'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Users, User, AlertCircle, ChevronRight } from 'lucide-react';
import { authService } from '../../../services/authService';
import { teamService } from '../../../services/teamService';
import Link from 'next/link';
import { Badge } from '../../../components/ui/badge';

interface Team {
  id: string;
  team_name: string;
  coach_id: string;
  coach_name?: string;
  player_count?: number;
}

export default function CoachTeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
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

    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const allTeams = await teamService.getAllTeams();

        if (allTeams.error) {
          setError(allTeams.error);
          return;
        }

        // Filter teams where this coach is assigned
        const coachTeams = allTeams.filter(
          (team: Team) =>
            team.coach_id === user.userId ||
            (typeof team.coach_id === 'string' &&
              team.coach_id === user.userId) ||
            (typeof team.coach_id === 'number' &&
              team.coach_id === Number.parseInt(user.userId))
        );

        setTeams(coachTeams);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [router]);

  return (
    <div className="min-h-screen bg-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">My Teams</h1>
        <p className="text-gray-600 mt-2">Teams you're assigned to coach</p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-club-red"></div>
        </div>
      ) : error ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="bg-red-100 text-red-600 p-4 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.length > 0 ? (
            teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-white border-gray-200 shadow-sm hover:border-club-red transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-800">
                          {team.team_name}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <User className="h-4 w-4 text-green-400 mr-2" />
                          Coach: {userData?.firstName} {userData?.lastName}
                        </CardDescription>
                      </div>
                      <Badge className="bg-club-red/20 text-club-red">
                        {team.player_count || 0}{' '}
                        {team.player_count === 1 ? 'Member' : 'Members'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/coach/teams/${team.id}`}>
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-gray-600 hover:text-club-red"
                      >
                        View Team Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="pt-6 pb-6 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    No Teams Assigned
                  </h3>
                  <p className="text-gray-600">
                    You haven't been assigned to any teams yet. Please contact
                    an administrator.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
