'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface RegisterFormProps {
  onSuccess?: (userData?: {
    firstName: string;
    lastName: string;
    userId: string;
    role: string;
  }) => void;
  onLoginClick?: () => void;
  returnUrl?: string;
}

export default function RegisterForm({
  onSuccess,
  onLoginClick,
  returnUrl,
}: RegisterFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!firstName || !lastName || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Since registration is now admin-only, we'll show a message instead
      setError(
        'Registration is currently only available through an administrator. Please contact the club for assistance.'
      );

      // In a real implementation with admin access, you would use:
      // const result = await userService.registerUser(firstName, lastName, password, "player")

      setIsLoading(false);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Create an account</h2>
        <p className="text-gray-600">Enter your information to sign up</p>
      </div>

      <Alert
        variant="destructive"
        className="bg-amber-50 text-amber-600 border border-amber-200"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Registration Notice</AlertTitle>
        <AlertDescription>
          Registration is currently only available through an administrator.
          Please contact the club for assistance.
        </AlertDescription>
      </Alert>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-700">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="bg-white border-gray-300 text-gray-800 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="bg-white border-gray-300 text-gray-800 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="registerPassword" className="text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Input
              id="registerPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white border-gray-300 text-gray-800 focus:ring-primary focus:border-primary pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white border-gray-300 text-gray-800 focus:ring-primary focus:border-primary"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account?</span>{' '}
        <Button
          variant="link"
          className="p-0 h-auto text-primary hover:text-primary/80"
          onClick={onLoginClick}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}
