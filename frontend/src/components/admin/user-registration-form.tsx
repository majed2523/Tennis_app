'use client';

import type React from 'react';

import { useState } from 'react';
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
import { userService } from '../../services/userService';
import { AlertCircle, CheckCircle, UserPlus } from 'lucide-react';

export default function UserRegistrationForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!firstName || !lastName || !password || !role) {
      setError('All fields are required');
      return;
    }

    setIsLoading(true);

    try {
      const result = await userService.registerUser(
        firstName,
        lastName,
        password,
        role
      );

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(
          `Successfully registered ${firstName} ${lastName} as a ${role}`
        );
        // Reset form
        setFirstName('');
        setLastName('');
        setPassword('');
        setRole('');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error registering user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Register New User
        </CardTitle>
        <CardDescription className="text-gray-400">
          Add a new player or coach to the system
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
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role" className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="player">Player</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register User'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
