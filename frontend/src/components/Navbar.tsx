'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    userId: string;
    role: string;
  } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const storedUserData = localStorage.getItem('userData');

      if (token) {
        setIsAuthenticated(true);
        if (storedUserData) {
          try {
            const parsedData = JSON.parse(storedUserData);
            setUserData(parsedData);
            console.log('🔹 Navbar loaded user data:', parsedData);
          } catch (error) {
            console.error('Error parsing userData:', error);
          }
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    };

    checkAuth();

    // Listen for auth changes
    window.addEventListener('authChange', checkAuth);
    window.addEventListener('storage', (e) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        checkAuth();
      }
    });

    return () => {
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', (e) => {
        if (e.key === 'authToken' || e.key === 'userData') {
          checkAuth();
        }
      });
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  // Get dashboard route based on user role
  const getDashboardRoute = () => {
    if (!userData) return '/login';

    switch (userData.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'coach':
        return '/coach/dashboard';
      case 'player':
        return '/player/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-white"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Tennis Club</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-10 space-x-8">
            <Link
              href="/"
              className={`text-gray-300 hover:text-white transition-colors ${
                pathname === '/' ? 'text-white font-medium' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/coaches"
              className={`text-gray-300 hover:text-white transition-colors ${
                pathname === '/coaches' ? 'text-white font-medium' : ''
              }`}
            >
              Coaches
            </Link>
            <Link
              href="/schedule"
              className={`text-gray-300 hover:text-white transition-colors ${
                pathname === '/schedule' ? 'text-white font-medium' : ''
              }`}
            >
              Schedule
            </Link>
            <Link
              href="/about"
              className={`text-gray-300 hover:text-white transition-colors ${
                pathname === '/about' ? 'text-white font-medium' : ''
              }`}
            >
              About
            </Link>
          </div>
        </div>

        {/* Authentication Section */}
        <div className="flex items-center">
          {isAuthenticated && userData ? (
            <div className="flex items-center">
              {/* Dashboard Button - Only show on larger screens */}
              <Link href={getDashboardRoute()} className="hidden md:block mr-4">
                <Button
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-500/10"
                >
                  Dashboard
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <div className="flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-green-500">
                        <span className="text-white font-medium">
                          {userData.firstName
                            ? userData.firstName.charAt(0)
                            : 'U'}
                          {userData.lastName ? userData.lastName.charAt(0) : ''}
                        </span>
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-gray-800 border-gray-700 text-white"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>
                        {userData.firstName} {userData.lastName}
                      </span>
                      <span className="text-xs text-gray-400 mt-1 capitalize">
                        {userData.role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <Link href={getDashboardRoute()}>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  {userData.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <Link href="/admin/register">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                          Register Users
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/teams">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                          Manage Teams
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  {userData.role === 'coach' && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <Link href="/coach/availability">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                          My Availability
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/coach/lessons">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                          My Lessons
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  {userData.role === 'player' && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <Link href="/player/lessons">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                          My Lessons
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-800"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-green-600 hover:bg-green-500 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="ml-4 md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 bg-gray-800 rounded-lg overflow-hidden"
        >
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/coaches"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Coaches
            </Link>
            <Link
              href="/schedule"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Schedule
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {isAuthenticated && (
              <Link
                href={getDashboardRoute()}
                className="block px-3 py-2 rounded-md text-base font-medium text-green-500 hover:text-green-400 hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
