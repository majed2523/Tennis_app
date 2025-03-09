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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // Validation
    if (
      !formData.phoneNumber ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage('Please fill all fields!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const result = await clientService.registerClient(
        formData.phoneNumber,
        formData.firstName,
        formData.lastName,
        formData.password
      );

      if (result.error) {
        setMessage(result.error);
        console.log('❌ Registration failed:', result.error);
      } else {
        setMessage('✅ Registration successful! Redirecting to login...');
        console.log('✅ Registration successful!');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (error) {
      setMessage('An unexpected error occurred');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-green-400">
            Join the Tennis Club 🎾
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
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
                  placeholder="Create password"
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
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="bg-gray-700 border-gray-600"
                required
              />
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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-green-400 hover:text-green-300"
                onClick={() => router.push('/login')}
              >
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
