'use client';

import { useEffect, useState } from 'react';
import { Calendar, Award, Clock, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import FeatureCards from '../components/FeatureCard';
import dynamic from 'next/dynamic';

// Dynamically import the SplineViewerBall component with no SSR
const SplineViewerBallSimple = dynamic(
  () => import('../components/SplineViewerBallSimple'),
  {
    ssr: false,
  }
);

// Fallback tennis ball in case the Spline viewer doesn't work
const FallbackTennisBall = dynamic(
  () => import('../components/FallBackTennis'),
  {
    ssr: false,
  }
);

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [splineError, setSplineError] = useState(false);

  // Check if user is authenticated on component mount
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
            console.log('🔹 Home loaded user data:', parsedData);
          } catch (error) {
            console.error('Error parsing userData:', error);
          }
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    window.addEventListener('authChange', checkAuth);
    window.addEventListener('storage', (e) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        checkAuth();
      }
    });

    // Handle potential Spline errors
    const handleError = () => {
      setSplineError(true);
    };
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', (e) => {
        if (e.key === 'authToken' || e.key === 'userData') {
          checkAuth();
        }
      });
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col justify-center items-center text-center px-6 pt-24 md:pt-32 pb-16 relative overflow-hidden"
      >
        {/* Tennis Ball - positioned to the side */}
        {splineError ? <FallbackTennisBall /> : <SplineViewerBallSimple />}

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-7xl md:text-8xl font-extrabold tracking-tight text-white drop-shadow-lg z-10"
        >
          <span className="text-green-400">Elevate</span> Your Game
        </motion.h1>

        {isAuthenticated && userData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6 z-10"
          >
            <h2 className="text-2xl font-bold text-white">
              Welcome back,{' '}
              <span className="text-green-400">{userData.firstName}</span>!
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mt-4">
              Ready for your next match? Access your tennis services below.
            </p>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl text-gray-400 max-w-3xl mt-4 md:mt-6 z-10"
          >
            Join us for world-class coaching, premium courts, and a vibrant
            tennis community.
          </motion.p>
        )}

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 md:mt-10 z-10 flex flex-wrap gap-4 justify-center"
        >
          {isAuthenticated ? (
            <>
              <Link href="/reservation">
                <Button className="bg-green-400 hover:bg-green-500 text-gray-900 text-lg font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-300">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Court
                </Button>
              </Link>
              <Link href="/schedule">
                <Button
                  variant="outline"
                  className="text-lg font-bold px-6 py-3 rounded-full border-green-400 text-green-400 hover:bg-green-400/10 transition-all duration-300"
                >
                  <Clock className="mr-2 h-5 w-5" />
                  View Schedule
                </Button>
              </Link>
              <Link href="/coaches">
                <Button
                  variant="outline"
                  className="text-lg font-bold px-6 py-3 rounded-full border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Award className="mr-2 h-5 w-5" />
                  Meet Coaches
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/register">
              <Button className="bg-green-400 hover:bg-green-500 text-gray-900 text-xl font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300">
                Get Started
              </Button>
            </Link>
          )}
        </motion.div>

        {isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="w-full max-w-6xl mx-auto mt-24 mb-16 z-10"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-green-400 mb-12 text-center">
              Your Tennis Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
              {/* Your Reservations Card */}
              <motion.div
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="col-span-1"
              >
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 h-full overflow-hidden group">
                  <CardHeader className="bg-gradient-to-r from-green-600/20 to-blue-600/20 pb-8">
                    <CardTitle className="text-2xl text-white flex items-center">
                      <Calendar className="mr-2 h-6 w-6 text-green-400" />
                      Your Reservations
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      View and manage your upcoming court bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      <li className="flex justify-between items-center p-3 bg-gray-700/30 rounded-md">
                        <div>
                          <p className="font-medium text-white">Center Court</p>
                          <p className="text-sm text-gray-400">
                            Tomorrow, 10:00 - 11:30
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-400 hover:text-green-500 hover:bg-green-400/10"
                        >
                          Details
                        </Button>
                      </li>
                      <li className="flex justify-between items-center p-3 bg-gray-700/30 rounded-md">
                        <div>
                          <p className="font-medium text-white">Court 3</p>
                          <p className="text-sm text-gray-400">
                            Friday, 15:30 - 17:00
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-400 hover:text-green-500 hover:bg-green-400/10"
                        >
                          Details
                        </Button>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="border-t border-gray-700/50 pt-4">
                    <Link href="/reservation" className="w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-between group-hover:text-green-400 transition-colors"
                      >
                        Book New Reservation
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
              {/* Add more content here */}
            </div>
          </motion.div>
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-5xl md:text-6xl font-extrabold text-green-400 mt-32 mb-16 text-center"
            >
              Explore Our Features
            </motion.h2>
            <div className="mt-8">
              <FeatureCards />
            </div>
          </>
        )}
      </motion.section>
    </div>
  );
}
