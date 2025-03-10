'use client';

<<<<<<< HEAD
import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { Button } from '../../components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';

interface CalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export default function CalendarPicker({ selectedDate, onSelect }: CalendarProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal bg-gray-700 border-gray-600 hover:bg-gray-600"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, 'PPP')
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-gray-800 border-gray-700"
        align="start"
      >
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            console.log("Date selected:", date);
            onSelect(date);
          }}
          initialFocus
          disabled={(date) => date < new Date()}
        />
      </PopoverContent>
    </Popover>
=======
import type React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, isBefore, isAfter } from 'date-fns';
import { AlertCircle, CheckCircle, Clock, MapPin, Users } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import reservationService from '../../services/reservationService';
import { Badge } from '../../components/ui/badge';

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [availableTimeSlots, setAvailableTimeSlots] = useState(timeSlots);

  // Calculate date limits - only allow today and tomorrow
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const maxDate = tomorrow;

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
      router.push('/login?returnUrl=/reservation');
    }
  }, [router]);

  // Filter time slots based on current time
  useEffect(() => {
    if (!date) return;

    const currentDate = new Date();
    const isToday =
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();

    if (isToday) {
      // If today, only show time slots that are at least 1 hour from now
      const currentHour = currentDate.getHours();
      const currentMinutes = currentDate.getMinutes();

      const filteredSlots = timeSlots.filter((slot) => {
        const slotHour = Number.parseInt(slot.split(':')[0]);
        return (
          slotHour > currentHour + 1 ||
          (slotHour === currentHour + 1 && currentMinutes < 30)
        );
      });

      setAvailableTimeSlots(filteredSlots);

      // Clear selected time slot if it's no longer available
      if (timeSlot && !filteredSlots.includes(timeSlot)) {
        setTimeSlot('');
      }
    } else {
      // If tomorrow, show all time slots
      setAvailableTimeSlots(timeSlots);
    }
  }, [date, timeSlot]);

  const handleNextStep = () => {
    if (activeStep === 1 && !date) {
      setError('Please select a date');
      return;
    }

    if (activeStep === 2 && !timeSlot) {
      setError('Please select a time slot');
      return;
    }

    setError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

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
          setDate(new Date());
          setTimeSlot('');
          setActiveStep(1);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-24 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
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
                onClick={() => router.push('/login?returnUrl=/reservation')}
                className="bg-green-600 hover:bg-green-500"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col justify-center items-center text-center px-6 pt-24 pb-16"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl font-extrabold tracking-tight text-white"
        >
          <span className="text-green-400">Reserve</span> Your Court
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl text-gray-300 max-w-3xl mt-4"
        >
          Book your preferred time and date with our easy-to-use reservation
          system.
        </motion.p>
      </motion.section>

      <section className="max-w-4xl mx-auto px-4 pb-24">
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 rounded-lg overflow-hidden"
        >
          {/* Progress Steps */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-800/50 border-b border-gray-700">
            <motion.div
              variants={itemVariants}
              className={`flex items-center ${
                activeStep >= 1 ? 'text-green-400' : 'text-gray-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  activeStep >= 1
                    ? 'bg-green-400 text-gray-900'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                1
              </div>
              <span className="font-medium">Select Date</span>
            </motion.div>

            <div className="h-0.5 w-12 bg-gray-700 mx-2">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: activeStep >= 2 ? '100%' : '0%' }}
                className="h-full bg-green-400"
                transition={{ duration: 0.3 }}
              />
            </div>

            <motion.div
              variants={itemVariants}
              className={`flex items-center ${
                activeStep >= 2 ? 'text-green-400' : 'text-gray-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  activeStep >= 2
                    ? 'bg-green-400 text-gray-900'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                2
              </div>
              <span className="font-medium">Select Time</span>
            </motion.div>

            <div className="h-0.5 w-12 bg-gray-700 mx-2">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: activeStep >= 3 ? '100%' : '0%' }}
                className="h-full bg-green-400"
                transition={{ duration: 0.3 }}
              />
            </div>

            <motion.div
              variants={itemVariants}
              className={`flex items-center ${
                activeStep >= 3 ? 'text-green-400' : 'text-gray-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  activeStep >= 3
                    ? 'bg-green-400 text-gray-900'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                3
              </div>
              <span className="font-medium">Confirm</span>
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {userData && (
              <motion.div
                variants={itemVariants}
                className="bg-gray-700/50 p-4 rounded-lg mb-4"
              >
                <p className="text-green-400 font-medium">
                  Booking as: {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm text-gray-400">
                  Phone: {userData.phone_number}
                </p>
              </motion.div>
            )}

            {/* Step 1: Date Selection */}
            {activeStep === 1 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="text-lg">Select Date</Label>
                  <p className="text-gray-400 text-sm mb-4">
                    You can only book courts for today or tomorrow
                  </p>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => {
                        // Only allow today and tomorrow
                        return isBefore(date, today) || isAfter(date, maxDate);
                      }}
                      className="mx-auto"
                    />
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex justify-end"
                >
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-green-600 hover:bg-green-500"
                  >
                    Next Step
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Time Selection */}
            {activeStep === 2 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label className="text-lg">Select Time Slot</Label>
                  <p className="text-gray-400 text-sm mb-4">
                    {date && format(date, 'EEEE, MMMM d, yyyy')}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((slot) => (
                        <motion.div
                          key={slot}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            className={`w-full h-16 ${
                              timeSlot === slot
                                ? 'bg-green-400 text-gray-900 border-green-400'
                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                            }`}
                            onClick={() => setTimeSlot(slot)}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {slot}
                          </Button>
                        </motion.div>
                      ))
                    ) : (
                      <p className="col-span-3 text-center text-gray-400 py-8">
                        No available time slots for this date
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex justify-between"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="border-gray-600"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-green-600 hover:bg-green-500"
                  >
                    Next Step
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: Court Selection and Confirmation */}
            {activeStep === 3 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="space-y-4">
                  <Label className="text-lg">Select Court</Label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {courts.map((court) => (
                      <motion.div
                        key={court.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer h-full ${
                            selectedCourt === court.id
                              ? 'bg-green-400/20 border-green-400'
                              : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                          }`}
                          onClick={() => setSelectedCourt(court.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold">{court.name}</h3>
                              <Badge className="bg-gray-600">
                                {court.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">
                              {court.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="bg-gray-700/30 p-4 rounded-lg"
                >
                  <h3 className="font-bold text-lg mb-3">
                    Reservation Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-green-400 mr-2" />
                      <span>{date && format(date, 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-green-400 mr-2" />
                      <span>{timeSlot}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-green-400 mr-2" />
                      <span>
                        {courts.find((c) => c.id === selectedCourt)?.name} (
                        {courts.find((c) => c.id === selectedCourt)?.type})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-green-400 mr-2" />
                      <span>
                        Booked by: {userData?.firstName} {userData?.lastName}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    variants={itemVariants}
                    className="bg-red-500/20 text-red-400 p-4 rounded-lg flex items-center"
                  >
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                  </motion.div>
                )}

                <motion.div
                  variants={itemVariants}
                  className="flex justify-between"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="border-gray-600"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Confirm Booking'}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </section>
    </div>
>>>>>>> 7f77fe7 (fixed auth with no ball animation and messy reservation front)
  );
}
