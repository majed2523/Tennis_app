'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AlertCircle, Users, ArrowLeft, UserX, Trash2 } from 'lucide-react';
import { teamService } from '../../services/teamService';
import { Alert, AlertDescription } from '../ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { authService } from '../../services/authService';

interface Player {
  id: string;
  first_name: string;
  lastName?: string;
  last_name: string;
  firstName?: string;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  // Remove player state
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [removingPlayer, setRemovingPlayer] = useState<Player | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removeSuccess, setRemoveSuccess] = useState<string | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setIsAdmin(user?.role === 'admin');
  }, []);

  useEffect(() => {
    const userData = authService.getCurrentUser();
    setIsAdmin(userData?.role === 'admin');

    const fetchTeamDetails = async () => {
      try {
        setIsLoading(true);
        const teamData = await teamService.getTeam(Number(teamId));

        if (teamData.error) {
          setError(teamData.error);
          return;
        }

        console.log('🔹 Updating UI with team:', teamData);
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

  const handleRemovePlayerClick = (player: Player) => {
    setRemovingPlayer(player);
    setRemoveError(null);
    setRemoveSuccess(null);
    setIsRemoveDialogOpen(true);
  };

  const handleRemovePlayer = async () => {
    if (!removingPlayer || !team) return;

    setRemoveError(null);
    setRemoveSuccess(null);

    try {
      const result = await teamService.removePlayerFromTeam(
        team.id,
        removingPlayer.id
      );

      if (result.error) {
        setRemoveError(result.error);
      } else {
        setRemoveSuccess(
          `Successfully removed ${
            removingPlayer.first_name || removingPlayer.firstName
          } ${
            removingPlayer.last_name || removingPlayer.lastName
          } from the team`
        );

        if (team.players) {
          const updatedPlayers = team.players.filter(
            (p) => p.id !== removingPlayer.id
          );
          setTeam({
            ...team,
            players: updatedPlayers,
            player_count: (team.player_count || 0) - 1,
          });
        }

        setTimeout(() => {
          setIsRemoveDialogOpen(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error removing player:', error);
      setRemoveError('An unexpected error occurred');
    }
  };

  const handleDeleteTeam = async () => {
    try {
      setIsLoading(true);
      const result = await teamService.deleteTeam(teamId);

      if (result.error) {
        setError(result.error);
        setDeleteDialogOpen(false);
      } else {
        router.push('/admin/teams');
      }
    } catch (err) {
      console.error('Error deleting team:', err);
      setError('Failed to delete team');
      setDeleteDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            {/* Loading spinner changed to red */}
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-400"></div>
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <Card className="w-full bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mr-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            {/* Title changed to red */}
            <CardTitle className="text-2xl font-bold text-red-400">
              {team?.team_name || 'Team Details'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Coach: {team?.coach_name || 'Loading...'}
            </CardDescription>
          </div>
        </div>
        {isAdmin && (
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            // Button changed to red
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete Team
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <h3 className="text-lg font-semibold text-white mb-4">Team Members</h3>

        {!team.players || team.players.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-gray-700/30 rounded-md">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-500" />
            <p>No players have been assigned to this team yet.</p>
          </div>
        ) : (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {team.players.map((player) => (
                <motion.div
                  key={player.id}
                  variants={itemVariants}
                  exit="exit"
                  layout
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-md hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center">
                    {/* If you'd like the avatar to be red, you can change from bg-green-600 to bg-red-600 */}
                    <Avatar className="h-10 w-10 bg-red-600 text-white">
                      <AvatarFallback>
                        {(player.first_name || player.firstName || '').charAt(
                          0
                        )}
                        {(player.last_name || player.lastName || '').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="font-medium text-white">
                        {player.first_name || player.firstName}{' '}
                        {player.last_name || player.lastName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {player.role || 'Player'}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      // "Remove" icon also changed from green to red
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={() => handleRemovePlayerClick(player)}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
        <Button variant="outline" onClick={onBack} className="text-gray-300">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Teams
        </Button>
      </CardFooter>

      {/* Remove Player Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Remove Player from Team</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to remove this player from the team? This
              action can be undone by adding the player back to the team later.
            </DialogDescription>
          </DialogHeader>

          {removeError && (
            <Alert className="bg-red-900/20 border-red-900/30 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{removeError}</AlertDescription>
            </Alert>
          )}

          {removeSuccess && (
            <Alert className="bg-green-900/20 border-green-900/30 text-green-400">
              <AlertDescription>{removeSuccess}</AlertDescription>
            </Alert>
          )}

          {removingPlayer && (
            <div className="py-2">
              <p className="font-medium text-white">
                {removingPlayer.first_name || removingPlayer.firstName}{' '}
                {removingPlayer.last_name || removingPlayer.lastName}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Will be removed from {team.team_name}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRemoveDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRemovePlayer}
              className="bg-red-600 hover:bg-red-500"
            >
              Remove Player
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Team Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-400">
              Delete Team
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete the team "{team?.team_name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTeam}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
