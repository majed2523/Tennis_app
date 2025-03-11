'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '../../../services/AdminService';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await adminLogin(username, password);
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_role', response.role);

      // Redirect based on role
      if (response.role === 'schedule_manager') {
        router.push('/admin/schedule');
      } else if (response.role === 'booking_manager') {
        router.push('/admin/bookings');
      } else {
        router.push('/admin/dashboard'); // Default admin dashboard
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl mb-4">Admin Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        className="p-2 mb-3 text-black rounded"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="p-2 mb-3 text-black rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
