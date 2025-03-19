'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Home,
  Calendar,
  Users,
  Info,
  Megaphone,
} from 'lucide-react';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    userId: string;
    role: string;
  } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

    // Add scroll listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', (e) => {
        if (e.key === 'authToken' || e.key === 'userData') {
          checkAuth();
        }
      });
      window.removeEventListener('scroll', handleScroll);
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

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Coaches', href: '/coaches', icon: Users },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Announcements', href: '/announcements', icon: Megaphone },
    { name: 'About', href: '/about', icon: Info },
  ];

  return (
    <nav
      className={`py-4 px-6 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-md shadow-md'
          : 'bg-gray-900 border-b border-gray-800'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 relative mr-3">
              <Image
                src="/assets/download.jpeg"
                alt="Tennis Club Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">Tennis Club</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-10 space-x-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <Button
                  variant="ghost"
                  className={`text-base px-4 ${
                    pathname === link.href
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/70'
                  }`}
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Authentication Section */}
        <div className="flex items-center">
          {isAuthenticated && userData ? (
            <div className="flex items-center">
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                        <span className="text-white font-medium text-sm">
                          {userData.firstName
                            ? userData.firstName.charAt(0)
                            : 'U'}
                          {userData.lastName ? userData.lastName.charAt(0) : ''}
                        </span>
                      </div>
                      <span className="ml-2 text-white hidden sm:inline-block">
                        {userData.firstName}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
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
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  {userData.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <Link href="/admin/register">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                          <Users className="mr-2 h-4 w-4" />
                          Register Users
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/teams">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                          <Users className="mr-2 h-4 w-4" />
                          Manage Teams
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/schedule">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                          <Calendar className="mr-2 h-4 w-4" />
                          Manage Schedule
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  {(userData.role === 'coach' || userData.role === 'admin') && (
                    <Link href="/announcements">
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                        <Megaphone className="mr-2 h-4 w-4" />
                        Announcements
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {userData.role === 'coach' && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <Link href="/coach/availability">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                          <Calendar className="mr-2 h-4 w-4" />
                          My Availability
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/coach/lessons">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                          <Users className="mr-2 h-4 w-4" />
                          My Lessons
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  {userData.role === 'player' && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <Link href="/player/lessons">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                          <Calendar className="mr-2 h-4 w-4" />
                          My Lessons
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-gray-700 focus:bg-gray-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link href="/login">
                <Button className="bg-green-600 hover:bg-green-500 text-white">
                  Sign in
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="ml-4 md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'text-white bg-gray-700'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <link.icon className="mr-2 h-5 w-5" />
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href={getDashboardRoute()}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-green-500 hover:text-green-400 hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
