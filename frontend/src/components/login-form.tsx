'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { clientService } from '../services/apiService';

interface LoginFormProps {
  onSuccess?: (userData?: {
    firstName: string;
    lastName: string;
    phone_number: string;
  }) => void;
  onRegisterClick?: () => void;
  returnUrl?: string;
}

export default function LoginForm({
  onSuccess,
  onRegisterClick,
  returnUrl,
}: LoginFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await clientService.loginClient(phoneNumber, password);
      console.log('🔹 Raw login response:', result);

      if (result.error) {
        setError(result.error);
      } else {
        // Extract user data from the response
        // The API returns first_name and last_name directly in the response
        const userData = {
          firstName: result.first_name || '',
          lastName: result.last_name || '',
          phone_number: phoneNumber,
        };

        console.log('🔹 Extracted user data:', userData);

        // Store user data in localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(userData));

        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('authChange'));

        // Login successful
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
            router.push('/'); // Redirect to home if no return URL
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
        <p className="text-gray-400">Enter your credentials to sign in</p>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button
              type="button"
              variant="link"
              className="text-xs text-gray-400 hover:text-green-400 p-0 h-auto"
            >
              Forgot password?
            </Button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-400">Don't have an account?</span>{' '}
        <Button
          variant="link"
          className="p-0 h-auto text-green-400 hover:text-green-300"
          onClick={onRegisterClick}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
}
