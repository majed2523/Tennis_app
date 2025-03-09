'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CalendarIcon, AlertCircle, CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import  Calendar  from '../../components/ui/calendar';
import { Label } from '../../components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useRouter } from 'next/navigation';
import reservationService from '../../services/reservationService';

// Define court data
const courts = [
  {
    id: '1',
    name: 'Center Court',
    type: 'Clay',
    description: 'Premier clay court with stadium seating',
  },
  {
    id: '2',
    name: 'Court 2',
    type: 'Hard',
    description: 'All-weather hard court with lighting',
  },
  {
    id: '3',
    name: 'Court 3',
    type: 'Grass',
    description: 'Traditional grass court',
  },
];

// Define time slots
const timeSlots = [
  '08:00 - 09:30',
  '09:30 - 11:00',
  '11:00 - 12:30',
  '12:30 - 14:00',
  '14:00 - 15:30',
  '15:30 - 17:00',
  '17:00 - 18:30',
  '18:30 - 20:00',
  '20:00 - 21:30',
];

export default function ReservationPage() {
  const router = useRouter();
  const [selectedCourt, setSelectedCourt] = useState('1');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');

    if (token) {
      setIsAuthenticated(true);
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          console.log('🔹 Retrieved User Data:', parsedUserData);
          setUserData(parsedUserData);
        } catch (error) {
          console.error('❌ Error parsing userData:', error);
        }
      }
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError('You must be logged in to make a reservation');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    if (!timeSlot) {
      setError('Please select a time slot');
      return;
    }

    setIsLoading(true);

    const reservationData = {
      court_id: selectedCourt,
      reservation_time: `${format(date, 'yyyy-MM-dd')}T${
        timeSlot.split(' - ')[0]
      }:00`,
    };

    console.log('🔹 Sending Reservation Data:', reservationData);

    try {
      const response = await reservationService.createReservation(
        reservationData
      );

      if (response.error) {
        setError(response.error);
        console.error('❌ Reservation failed:', response.error);
      } else {
        setBookingSuccess(true);
        setError(null);

        // Reset form after successful booking
        setTimeout(() => {
          setDate(undefined);
          setTimeSlot('');
          setBookingSuccess(false);
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Reservation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col justify-center items-center text-center px-6 pt-24 pb-16"
      >
        <motion.h1 className="text-5xl font-extrabold tracking-tight text-white">
          <span className="text-green-400">Reserve</span> Your Court
        </motion.h1>
        <motion.p className="text-xl text-gray-300 max-w-3xl mt-4">
          Book your preferred time and date with our easy-to-use reservation
          system.
        </motion.p>
      </motion.section>

      <section className="max-w-3xl mx-auto px-4 pb-24">
        {bookingSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6 flex items-center"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Booking confirmed! Your court has been reserved.
          </motion.div>
        )}

        {!isAuthenticated ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-green-400">
                Authentication Required
              </CardTitle>
              <CardDescription className="text-gray-400">
                You need to be logged in to make a reservation
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                onClick={() => router.push('/login')}
                className="bg-green-600 hover:bg-green-500"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-800 p-6 rounded-lg"
          >
            {userData && (
              <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
                <p className="text-green-400 font-medium">
                  Booking as: {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm text-gray-400">
                  Phone: {userData.phone_number}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-gray-700 border-gray-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                  <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date: Date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Select Time Slot</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {timeSlots.map((slot) => (
                    <SelectItem
                      key={slot}
                      value={slot}
                      className="hover:bg-gray-700"
                    >
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Court</Label>
              <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Choose a court" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {courts.map((court) => (
                    <SelectItem
                      key={court.id}
                      value={court.id}
                      className="hover:bg-gray-700"
                    >
                      {court.name} ({court.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-400 p-4 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Book Court'}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
