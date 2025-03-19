'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { teamService } from '../../services/teamService';
import {
  Users,
  User,
  AlertCircle,
  ChevronRight,
  UserPlus,
  Trash2,
} from 'lucide-react';
import TeamDetails from './team-details';
import AssignPlayerForm from './assign-player-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { authService } from '../../services/authService';
import { motion, AnimatePresence } from 'framer-motion';

interface Team {
  id: string;
  team_name: string;
  coach_id: string;
  coach_name?: string;
  player_count?: number;
  isDeleting?: boolean;
}

export default function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      const result = await teamService.getAllTeams();
      console.log('🔹 API Response (Teams):', result); // Debugging output

      if (result.error) {
        setError(result.error);
      } else {
        setTeams(Array.isArray(result) ? result : []);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setIsAdmin(user?.role === 'admin');
  }, []);

  const handleViewTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const handleBackToTeams = () => {
    setSelectedTeamId(null);
  };

  const handleToggleAssignForm = () => {
    setShowAssignForm((prev) => !prev);
  };

  const handlePlayerAssigned = () => {
    fetchTeams(); // Refresh teams list after assigning player
  };

  const handleDeleteClick = (team: Team, e: React.MouseEvent) => {
    e.stopPropagation();
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      // Mark the team as deleting to show loading state
      setTeams(
        teams.map((t) =>
          t.id === teamToDelete.id ? { ...t, isDeleting: true } : t
        )
      );

      const result = await teamService.deleteTeam(teamToDelete.id);

      if (result.error) {
        setError(result.error);
      } else {
        // Remove the team from the list
        setTeams(teams.filter((t) => t.id !== teamToDelete.id));
      }
    } catch (err) {
      console.error('Error deleting team:', err);
      setError('Failed to delete team');
    } finally {
      setDeleteDialogOpen(false);
      setTeamToDelete(null);
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

  if (error) {
    return (
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="bg-red-500/20 text-red-400 p-4 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedTeamId) {
    return <TeamDetails teamId={selectedTeamId} onBack={handleBackToTeams} />;
  }

  return (
    <div className="space-y-6">
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold text-green-400 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Tennis Teams
            </CardTitle>
            <CardDescription className="text-gray-400">
              All active teams and their coaches
            </CardDescription>
          </div>
          <Button
            onClick={handleToggleAssignForm}
            className={
              showAssignForm ? 'bg-gray-700' : 'bg-green-600 hover:bg-green-500'
            }
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {showAssignForm ? 'Hide Form' : 'Assign Player'}
          </Button>
        </CardHeader>

        {showAssignForm && (
          <CardContent className="pt-0 pb-6 border-b border-gray-700">
            <AssignPlayerForm
              teams={teams}
              onPlayerAssigned={handlePlayerAssigned}
            />
          </CardContent>
        )}

        <CardContent className={showAssignForm ? 'pt-6' : ''}>
          {teams.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-500" />
              <p>No teams have been created yet.</p>
              <p className="text-sm mt-1">Create a team to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {teams.map((team) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-700/50 p-4 rounded-md border border-gray-600 hover:border-green-400 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-white text-lg">
                        {team.team_name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-400/20 text-green-400">
                          {team.player_count ?? 0} Members
                        </Badge>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={(e) => handleDeleteClick(team, e)}
                            disabled={team.isDeleting}
                          >
                            {team.isDeleting ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-gray-300 mb-4">
                      <User className="h-4 w-4 text-green-400 mr-2" />
                      <span>Coach: {team.coach_name || 'Unknown'}</span>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full justify-between text-gray-300 hover:text-green-400 hover:bg-gray-700"
                      onClick={() => handleViewTeam(team.id)}
                    >
                      View Team Details
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Team Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-400">
              Delete Team
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete the team "
              {teamToDelete?.team_name}"? This action cannot be undone.
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
    </div>
  );
}
