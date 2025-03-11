'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  User,
  LogOut,
  Calendar,
  Settings,
  Trophy,
  Clock,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import LoginForm from './login-form';
import RegisterForm from './register-form';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    phone_number: string;
  } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated on component mount and on localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const storedUserData = localStorage.getItem('userData');
      const role = localStorage.getItem('admin_role'); // Check for admin role

      if (token) {
        setIsAuthenticated(true);

        if (storedUserData) {
          try {
            const parsedData = JSON.parse(storedUserData);
            // Ensure user data has required fields
            if (parsedData && parsedData.firstName && parsedData.lastName) {
              setUserData(parsedData);
              console.log('🔹 Navbar loaded user data:', parsedData);
            } else {
              console.error('❌ Invalid user data format:', parsedData);
              localStorage.removeItem('userData');
              setIsAuthenticated(false);
              setUserData(null);
            }
          } catch (error) {
            console.error('❌ Error parsing userData:', error);
            localStorage.removeItem('userData');
            setIsAuthenticated(false);
            setUserData(null);
          }
        }

        // ✅ Check if the user is Admin1 (schedule_manager)
        if (role === 'schedule_manager') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
        setIsAdmin(false);
      }
    };

    // Check authentication on mount
    checkAuth();

    // Listen for localStorage changes from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'authToken' ||
        e.key === 'userData' ||
        e.key === 'admin_role'
      ) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-tab updates
    const handleAuthChange = () => checkAuth();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);


  const handleAuthSuccess = (userData?: {
    firstName: string;
    lastName: string;
    phone_number: string;
  }) => {
    setIsAuthOpen(false);
    setIsAuthenticated(true);
    if (userData) {
      setUserData(userData);
    }

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));

    // Redirect based on where the user came from
    if (pathname === '/login' || pathname === '/register') {
      router.push('/');
    } else {
      // Stay on the current page (e.g., if logging in from reservation page)
      router.refresh();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData(null);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));

    router.push('/');
  };

  const getUserInitials = () => {
    if (!userData || !userData.firstName || !userData.lastName) return 'U';
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1E2E]/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-green-400"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
          <span className="ml-2 text-xl font-bold text-white">Tennis Club</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/registration"
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            Registration
          </Link>
          <Link
            href="/coaches"
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            Coaches
          </Link>
          <Link
            href="/reservation"
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            Reservation
          </Link>
          <Link
            href="/schedule"
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            Schedule
          </Link>
          <Link
            href="/about"
            className="text-gray-300 hover:text-green-400 transition-colors"
          >
            About
          </Link>
          {/* ✅ Show Admin Schedule only if user is Admin1 */}
          {isAdmin && (
            <Link
              href="/admin/schedule"
              className="text-red-400 hover:text-red-500 font-bold transition-colors"
            >
              Admin Schedule
            </Link>
          )}
        </nav>

        {/* Auth Buttons or User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 bg-green-600 hover:bg-green-500 transition-colors">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-gray-900 border-gray-800"
                align="end"
              >
                <DropdownMenuLabel className="text-gray-300">
                  {userData
                    ? `${userData.firstName} ${userData.lastName}`
                    : 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => router.push('/reservation')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>My Reservations</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => router.push('/schedule')}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Schedule</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => router.push('/coaches')}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Top Coaches</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => router.push('/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                  onClick={() => router.push('/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="text-red-400 hover:text-red-300 hover:bg-gray-800 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => setAuthMode('login')}
                  >
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
                  {authMode === 'login' ? (
                    <LoginForm
                      onSuccess={handleAuthSuccess}
                      onRegisterClick={() => setAuthMode('register')}
                      returnUrl={pathname}
                    />
                  ) : (
                    <RegisterForm
                      onSuccess={handleAuthSuccess}
                      onLoginClick={() => setAuthMode('login')}
                      returnUrl={pathname}
                    />
                  )}
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="bg-green-600 hover:bg-green-500 text-white"
                    onClick={() => {
                      setAuthMode('register');
                      setIsAuthOpen(true);
                    }}
                  >
                    Sign Up
                  </Button>
                </DialogTrigger>
              </Dialog>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-300"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-gray-900 text-white border-gray-800"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between py-4">
                <Link href="/" className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-green-400"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                  <span className="ml-2 text-xl font-bold">Tennis Club</span>
                </Link>
              </div>

              {isAuthenticated && userData && (
                <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-800/50 rounded-lg">
                  <Avatar className="h-10 w-10 bg-green-600">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {userData.firstName} {userData.lastName}
                    </p>
                    <p className="text-xs text-gray-400">Member</p>
                  </div>
                </div>
              )}

              <nav className="flex flex-col space-y-4 mt-4">
                <Link
                  href="/"
                  className="py-2 text-gray-300 hover:text-green-400 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/registration"
                  className="py-2 text-gray-300 hover:text-green-400 transition-colors"
                >
                  Registration
                </Link>
                <Link
                  href="/coaches"
                  className="py-2 text-gray-300 hover:text-green-400 transition-colors"
                >
                  Coaches
                </Link>
                <Link
                  href="/reservation"
                  className="py-2 text-gray-300 hover:text-green-400 transition-colors"
                >
                  Reservation
                </Link>
                <Link
                  href="/schedule"
                  className="py-2 text-gray-300 hover:text-green-400 transition-colors"
                >
                  Schedule
                </Link>
                <Link
                  href="/about"
                  className="py-2 text-gray-300 hover:text-green-400 transition-colors"
                >
                  About
                </Link>
              </nav>

              <div className="mt-auto space-y-4 py-4">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => {
                        setAuthMode('login');
                        setIsAuthOpen(true);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-500 text-white"
                      onClick={() => {
                        setAuthMode('register');
                        setIsAuthOpen(true);
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Auth Dialog for Mobile */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
          {authMode === 'login' ? (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onRegisterClick={() => setAuthMode('register')}
              returnUrl={pathname}
            />
          ) : (
            <RegisterForm
              onSuccess={handleAuthSuccess}
              onLoginClick={() => setAuthMode('login')}
              returnUrl={pathname}
            />
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
}

