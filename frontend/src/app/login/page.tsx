'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Eye, EyeOff } from 'lucide-react';
import { clientService } from '../../services/apiService';

export default function LoginPage() {
  const [formData, setFormData] = useState({ phoneNumber: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phoneNumber || !formData.password) {
      setMessage('Please fill all fields!');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await clientService.loginClient(
        formData.phoneNumber,
        formData.password
      );

      if (result.error) {
        setMessage(result.error);
        console.log('❌ Login failed:', result.error);
        return;
      }

      setMessage('✅ Login successful! Redirecting...');
      console.log('✅ Login successful!');
      router.push('/dashboard');
    } catch (error) {
      setMessage('An unexpected error occurred');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-green-400">
            Welcome Back 🎾
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600 pr-10"
                  required
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

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.includes('✅')
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-green-400 hover:text-green-300"
                onClick={() => router.push('/register')}
              >
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
