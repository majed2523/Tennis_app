'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { clientService } from '../services/apiService';

interface RegisterFormProps {
  onSuccess?: (userData?: {
    firstName: string;
    lastName: string;
    phone_number: string;
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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
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
      const result = await clientService.registerClient(
        phoneNumber,
        firstName,
        lastName,
        password
      );

      if (result.error) {
        setError(result.error);
      } else {
        // Registration successful
        // Auto-login the user
        const loginResult = await clientService.loginClient(
          phoneNumber,
          password
        );

        if (loginResult.error) {
          setError(loginResult.error);
        } else {
          // Save user data
          const userData = {
            firstName,
            lastName,
            phone_number: phoneNumber,
          };

          localStorage.setItem('userData', JSON.stringify(userData));

          // Dispatch custom event to notify other components
          window.dispatchEvent(new Event('authChange'));

          if (onSuccess) {
            onSuccess(userData);
          } else {
            // If no onSuccess handler, handle navigation here
            if (
              returnUrl &&
              returnUrl !== '/login' &&
              returnUrl !== '/register'
            ) {
              router.push(returnUrl);
            } else {
              router.push('/');
            }
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">Create an account</h2>
        <p className="text-gray-400">Enter your information to sign up</p>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="bg-gray-800 border-gray-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registerPassword">Password</Label>
          <div className="relative">
            <Input
              id="registerPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
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
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-400">Already have an account?</span>{' '}
        <Button
          variant="link"
          className="p-0 h-auto text-green-400 hover:text-green-300"
          onClick={onLoginClick}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}
