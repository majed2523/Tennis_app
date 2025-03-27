'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Edit,
  Award,
  Clock,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const storedUserData = localStorage.getItem('userData');

      if (!token) {
        router.push('/login?returnUrl=/profile');
        return;
      }

      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          // Make sure we have at least some basic user data
          if (parsedData) {
            // Set default values for missing fields to prevent undefined errors
            const sanitizedData = {
              firstName: parsedData.firstName || 'User',
              lastName: parsedData.lastName || '',
              phone_number: parsedData.phone_number || 'Not provided',
              ...parsedData,
            };
            setUserData(sanitizedData);
            setIsLoading(false);
          } else {
            console.error('❌ Invalid user data format:', parsedData);
            router.push('/login?returnUrl=/profile');
          }
        } catch (error) {
          console.error('Error parsing userData:', error);
          router.push('/login?returnUrl=/profile');
        }
      } else {
        router.push('/login?returnUrl=/profile');
      }
    };

    checkAuth();

    // Listen for auth changes
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!userData) {
    return null; // This should not happen due to the redirect, but just in case
  }

  const getUserInitials = () => {
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative"
            >
              <Avatar className="w-32 h-32 border-4 border-green-400">
                <AvatarFallback className="text-4xl bg-green-600">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 bg-green-400 hover:bg-green-500 text-gray-900 rounded-full h-8 w-8"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit Profile Picture</span>
              </Button>
            </motion.div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-gray-400 mt-2">
                Member since {new Date().getFullYear()}
              </p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                <Badge className="bg-green-400/20 text-green-400 hover:bg-green-400/30">
                  Active Member
                </Badge>
                <Badge className="bg-blue-400/20 text-blue-400 hover:bg-blue-400/30">
                  Intermediate
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="col-span-1"
          >
            <Card className="bg-gray-800/50 border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-400" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Phone Number</p>
                    <p className="font-medium">
                      {userData.phone_number || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium">
                      {'user@example.com' || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Date of Birth</p>
                    <p className="font-medium">{'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="font-medium">{'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-green-400/30 text-green-400 hover:bg-green-400/10"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Information
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Membership */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="col-span-1"
          >
            <Card className="bg-gray-800/50 border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-400" />
                  Membership
                </CardTitle>
                <CardDescription>Your current plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-400/10 rounded-lg p-4 border border-green-400/20">
                  <h3 className="font-bold text-green-400">
                    Standard Membership
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Valid until December 31, 2025
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Benefits:</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                      Court reservations up to 7 days in advance
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                      Access to all club facilities
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                      10% discount on coaching sessions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                      Participation in club tournaments
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-400 hover:bg-green-500 text-gray-900">
                  Upgrade Membership
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="col-span-1"
          >
            <Card className="bg-gray-800/50 border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-400" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-green-400 pl-4 py-1">
                    <p className="font-medium">Court Reservation</p>
                    <p className="text-sm text-gray-400">
                      Center Court • Tomorrow, 10:00 - 11:30
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Booked 2 days ago
                    </p>
                  </div>
                  <div className="border-l-2 border-blue-400 pl-4 py-1">
                    <p className="font-medium">Coaching Session</p>
                    <p className="text-sm text-gray-400">
                      With John Davis • Friday, 15:30 - 17:00
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Booked 5 days ago
                    </p>
                  </div>
                  <div className="border-l-2 border-purple-400 pl-4 py-1">
                    <p className="font-medium">Tournament Registration</p>
                    <p className="text-sm text-gray-400">
                      Summer Championship • Starts June 15
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Registered 1 week ago
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                >
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
