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
import { AlertCircle, Users, ArrowLeft, UserX } from 'lucide-react';
import { teamService } from '../../services/teamService';
import { authService } from '../../services/authService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Remove player state
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [removingPlayer, setRemovingPlayer] = useState<Player | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removeSuccess, setRemoveSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is admin
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

        // Update the team data by removing the player
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

        // Close dialog after a short delay
        setTimeout(() => {
          setIsRemoveDialogOpen(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error removing player:', error);
      setRemoveError('An unexpected error occurred');
    }
  };

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
            {team.player_count ?? team.players?.length ?? 0} Players
          </Badge>
        </div>
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
                    <Avatar className="h-10 w-10 bg-green-600 text-white">
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
    </Card>
  );
}
