'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Calendar,
  Clock,
  User,
  LogOut,
  Settings,
  UserPlus,
  BookOpen,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { authService } from '../../services/authService';

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userData = authService.getCurrentUser();
    if (userData) {
      setRole(userData.role);
    }
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
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
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Common links for all roles */}
        <Link href={`/${role}/dashboard`}>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              isActive(`/${role}/dashboard`)
                ? 'bg-green-400/10 text-green-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        </Link>

        <Link href={`/${role}/profile`}>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              isActive(`/${role}/profile`)
                ? 'bg-green-400/10 text-green-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="mr-2 h-5 w-5" />
            Profile
          </Button>
        </Link>

        {/* Admin-specific links */}
        {role === 'admin' && (
          <>
            <Link href="/admin/register">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/admin/register')
                    ? 'bg-green-400/10 text-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Register Users
              </Button>
            </Link>

            <Link href="/admin/teams">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/admin/teams')
                    ? 'bg-green-400/10 text-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="mr-2 h-5 w-5" />
                Manage Teams
              </Button>
            </Link>
          </>
        )}

        {/* Coach-specific links */}
        {role === 'coach' && (
          <>
            <Link href="/coach/availability">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/coach/availability')
                    ? 'bg-green-400/10 text-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Clock className="mr-2 h-5 w-5" />
                My Availability
              </Button>
            </Link>

            <Link href="/coach/lessons">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/coach/lessons')
                    ? 'bg-green-400/10 text-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Calendar className="mr-2 h-5 w-5" />
                My Lessons
              </Button>
            </Link>

            <Link href="/coach/teams">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/coach/teams')
                    ? 'bg-green-400/10 text-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="mr-2 h-5 w-5" />
                My Teams
              </Button>
            </Link>
          </>
        )}

        {/* Player-specific links */}
        {role === 'player' && (
          <>
            <Link href="/player/lessons">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/player/lessons')
                    ? 'bg-green-400/10 text-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Book Lessons
              </Button>
            </Link>

            <Link href="/player/schedule">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/player/schedule')
                    ? 'bg-green-400/10 text-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Calendar className="mr-2 h-5 w-5" />
                My Schedule
              </Button>
            </Link>

            <Link href="/player/teams">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive('/player/teams')
                    ? 'bg-green-400/10 text-green-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="mr-2 h-5 w-5" />
                My Teams
              </Button>
            </Link>
          </>
        )}

        <Link href={`/${role}/settings`}>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              isActive(`/${role}/settings`)
                ? 'bg-green-400/10 text-green-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
