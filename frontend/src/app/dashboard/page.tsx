'use client';

import { useEffect, useState } from 'react';
import { clientService } from '../../services/apiService';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  interface User {
    first_name: string;
    last_name: string;
    phone_number: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const result = await clientService.getClientDetails();
      if (result.error) {
        clientService.logoutClient();
        router.push('/login');
      } else {
        setUser(result);
      }
      setLoading(false);
    }
    fetchUser();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-green-400">Dashboard 🎾</h1>
      {user && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-lg">
            Welcome, {user.first_name} {user.last_name}!
          </p>
          <p className="text-sm">Phone: {user.phone_number}</p>

          <button
            onClick={() => {
              clientService.logoutClient();
              router.push('/login');
            }}
            className="mt-4 bg-red-500 p-2 rounded-lg text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
