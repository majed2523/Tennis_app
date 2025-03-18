'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Pencil, Trash2, AlertCircle, Search, RefreshCw } from 'lucide-react';
import { userService } from '../../services/userService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';

interface User {
  id: string;
  userId?: string;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  role: string;
}

export default function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Edit user state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserId, setNewUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Delete user state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const [players, coaches] = await Promise.all([
        userService.getAllPlayers(),
        userService.getAllCoaches(),
      ]);

      const allUsers = [
        ...(Array.isArray(players) ? players.map(normalizeUser) : []),
        ...(Array.isArray(coaches) ? coaches.map(normalizeUser) : []),
      ];

      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Normalize user data to handle different field names
  const normalizeUser = (user: any): User => {
    return {
      id: user.id || user.userId || '',
      userId: user.userId || user.id || '',
      firstName: user.firstName || user.first_name || '',
      lastName: user.lastName || user.last_name || '',
      first_name: user.first_name || user.firstName || '',
      last_name: user.last_name || user.lastName || '',
      role: user.role || '',
    };
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          (user.firstName || user.first_name || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (user.lastName || user.last_name || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (user.userId || '').toString().includes(searchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) => user.role.toLowerCase() === activeTab
      );
      setFilteredUsers(filtered);
    }
  }, [activeTab, users]);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setNewUserId(user.userId || '');
    setNewPassword('');
    setEditError(null);
    setEditSuccess(null);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setDeletingUser(user);
    setDeleteError(null);
    setDeleteSuccess(null);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    setEditError(null);
    setEditSuccess(null);

    try {
      const result = await userService.updateUser(
        editingUser.id,
        newUserId,
        newPassword
      );

      if (result.error) {
        setEditError(result.error);
      } else {
        setEditSuccess('User updated successfully');
        // Refresh the user list
        fetchUsers();

        // Close the dialog after a short delay
        setTimeout(() => {
          setIsEditDialogOpen(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setEditError('An unexpected error occurred');
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      const result = await userService.deleteUser(deletingUser.id);

      if (result.error) {
        setDeleteError(result.error);
      } else {
        setDeleteSuccess('User deleted successfully');
        // Refresh the user list
        fetchUsers();

        // Close the dialog after a short delay
        setTimeout(() => {
          setIsDeleteDialogOpen(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setDeleteError('An unexpected error occurred');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-500/20 text-red-400';
      case 'coach':
        return 'bg-blue-500/20 text-blue-400';
      case 'player':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <Button
          onClick={fetchUsers}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-gray-700">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="player">Players</TabsTrigger>
          <TabsTrigger value="coach">Coaches</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-12 h-12">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow className="hover:bg-gray-800/80 border-gray-700">
                <TableHead className="text-gray-300">ID</TableHead>
                <TableHead className="text-gray-300">Name</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-700/50 border-gray-700"
                  >
                    <TableCell className="font-medium text-gray-300">
                      {user.userId}
                    </TableCell>
                    <TableCell className="text-white">
                      {user.firstName || user.first_name}{' '}
                      {user.lastName || user.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                        onClick={() => handleEditClick(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => handleDeleteClick(user)}
                        disabled={user.role === 'admin'} // Prevent deleting admins
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-gray-500"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update user ID or password for{' '}
              {editingUser?.firstName || editingUser?.first_name}{' '}
              {editingUser?.lastName || editingUser?.last_name}
            </DialogDescription>
          </DialogHeader>

          {editError && (
            <Alert className="bg-red-900/20 border-red-900/30 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{editError}</AlertDescription>
            </Alert>
          )}

          {editSuccess && (
            <Alert className="bg-green-900/20 border-green-900/30 text-green-400">
              <AlertDescription>{editSuccess}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                New Password (leave blank to keep current)
              </Label>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              className="bg-blue-600 hover:bg-blue-500"
            >
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete{' '}
              {deletingUser?.firstName || deletingUser?.first_name}{' '}
              {deletingUser?.lastName || deletingUser?.last_name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <Alert className="bg-red-900/20 border-red-900/30 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          {deleteSuccess && (
            <Alert className="bg-green-900/20 border-green-900/30 text-green-400">
              <AlertDescription>{deleteSuccess}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-500"
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
