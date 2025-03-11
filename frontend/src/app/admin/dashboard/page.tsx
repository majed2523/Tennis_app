'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchSchedule,
  fetchBookings,
  manageSchedule,
  manageCourtBookings,
} from '../../../services/AdminService';

export default function AdminDashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [bookings, setBookings] = useState<any>(null);
  const [scheduleInput, setScheduleInput] = useState('');
  const [bookingInput, setBookingInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const role = localStorage.getItem('admin_role');

    if (!token || !role) {
      router.push('/admin/login'); // Redirect to login if not authenticated
    } else {
      setRole(role);

      if (role === 'schedule_manager') {
        fetchSchedule().then(setSchedule).catch(console.error);
      } else if (role === 'booking_manager') {
        fetchBookings().then(setBookings).catch(console.error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    router.push('/');
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl">Admin Dashboard ({role})</h1>
      <button
        className="mt-4 px-4 py-2 bg-red-500 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>

      {role === 'schedule_manager' && (
        <div className="mt-6">
          <h2 className="text-xl">Manage Schedule</h2>
          <textarea
            className="text-black p-2 w-full"
            value={scheduleInput}
            onChange={(e) => setScheduleInput(e.target.value)}
            placeholder="Enter new schedule"
          />
          <button
            onClick={() => manageSchedule({ schedule: scheduleInput })}
            className="bg-blue-500 px-4 py-2 rounded mt-2"
          >
            Save Schedule
          </button>
        </div>
      )}

      {role === 'booking_manager' && (
        <div className="mt-6">
          <h2 className="text-xl">Manage Court Bookings</h2>
          <input
            className="text-black p-2 w-full"
            type="text"
            value={bookingInput}
            onChange={(e) => setBookingInput(e.target.value)}
            placeholder="Enter new booking"
          />
          <button
            onClick={() => manageCourtBookings({ booking: bookingInput })}
            className="bg-green-500 px-4 py-2 rounded mt-2"
          >
            Save Booking
          </button>
        </div>
      )}
    </div>
  );
}
