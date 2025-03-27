'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Megaphone, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../../../services/authService';
import { announcementService } from '../../../services/announcementService';

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and can create announcements
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = authService.getCurrentUser();
    if (userData?.role !== 'admin' && userData?.role !== 'coach') {
      router.push('/announcements');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setIsLoading(true);

    try {
      announcementService.createAnnouncement(title, content, isImportant);
      setSuccess('Announcement created successfully');

      // Reset form
      setTitle('');
      setContent('');
      setIsImportant(false);

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/announcements');
      }, 2000);
    } catch (error) {
      console.error('Error creating announcement:', error);
      setError('Failed to create announcement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/announcements')}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Announcements
          </Button>

          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Megaphone className="h-7 w-7 text-purple-400" />
            Create Announcement
          </h1>
          <p className="text-gray-400 mt-2">
            Share important information with all users
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>New Announcement</CardTitle>
              <CardDescription>
                Fill out the form to create a new announcement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 bg-red-900/20 border-red-900/30 text-red-400">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 bg-green-900/20 border-green-900/30 text-green-400">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Enter announcement title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-gray-700 border-gray-600 min-h-[200px]"
                    placeholder="Enter announcement content..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="important"
                    checked={isImportant}
                    onCheckedChange={setIsImportant}
                  />
                  <Label htmlFor="important">Mark as important</Label>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Announcement'}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t border-gray-700 flex justify-between">
              <Button
                variant="outline"
                onClick={() => router.push('/announcements')}
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                Cancel
              </Button>
              <div className="text-sm text-gray-400">
                This announcement will be visible to all users
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
