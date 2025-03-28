'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { authService } from '../services/authService';
import { Alert, AlertDescription } from './ui/alert';

export default function LoginForm() {
  const [userId, setUserId] = useState('');
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
      const result = await authService.login(userId, password);

      if (result.error) {
        setError(result.error);
      } else {
        // Get user role and redirect accordingly
        const userData = authService.getCurrentUser();

        if (userData?.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (userData?.role === 'coach') {
          router.push('/coach/dashboard');
        } else {
          router.push('/player/dashboard');
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
    <div className="space-y-6 w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to Tennis Club
        </h1>
        <p className="text-gray-600">Sign in to access your account</p>
      </div>

      {error && (
        <Alert className="bg-red-50 text-red-500 border border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userId" className="text-gray-700">
            User ID
          </Label>
          <Input
            id="userId"
            type="text"
            placeholder="Enter your user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="bg-white border-gray-300 text-gray-800 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <Button
              type="button"
              variant="link"
              className="text-xs text-gray-500 hover:text-primary p-0 h-auto"
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

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center text-sm text-gray-600">
        <p>Need an account? Please contact the club administrator.</p>
      </div>
    </div>
  );
}
