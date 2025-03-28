'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/authService';
import UserRegistrationForm from '../../../components/admin/user-registration-form';
import UserManagementTable from '../../../components/admin/user-management-table';
import { motion } from 'framer-motion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { UserPlus, Users } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('register');

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = authService.getCurrentUser();
    if (userData?.role !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 p-6 md:p-8 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-club-red/20 via-gray-400/20 to-gray-500/20 rounded-xl"></div>
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 rounded-xl"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  User Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Register new users and manage existing accounts
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-club-red data-[state=active]:text-white"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Register User
            </TabsTrigger>
            <TabsTrigger
              value="manage"
              className="data-[state=active]:bg-club-red data-[state=active]:text-white"
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <UserRegistrationForm onSuccess={() => setActiveTab('manage')} />
            </motion.div>
          </TabsContent>

          <TabsContent value="manage" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-club-red" />
                    User Accounts
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    View, edit, and manage all user accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserManagementTable />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
