'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Megaphone,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
} from 'lucide-react';
import { authService } from '../../services/authService';
// import {
//   announcementService,
//   type Announcement,
// } from '@/services/announcementService';

export default function AnnouncementsPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [canCreateAnnouncements, setCanCreateAnnouncements] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingAnnouncement, setDeletingAnnouncement] =
    useState<Announcement | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Check if user can create announcements (admin or coach)
    const userData = authService.getCurrentUser();
    if (userData?.role === 'admin' || userData?.role === 'coach') {
      setCanCreateAnnouncements(true);
    }

    // Fetch announcements
    fetchAnnouncements();
  }, [router]);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await announcementService.getAllAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    // Validate form
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }

    if (!content.trim()) {
      setFormError('Content is required');
      return;
    }

    setFormError(null);
    setFormSuccess(null);

    try {
      await announcementService.createAnnouncement(title, content, isImportant);
      setFormSuccess('Announcement created successfully');

      // Reset form
      setTitle('');
      setContent('');
      setIsImportant(false);

      // Refresh announcements
      fetchAnnouncements();

      // Close dialog after a short delay
      setTimeout(() => {
        setIsCreateDialogOpen(false);
        setFormSuccess(null);
      }, 1500);
    } catch (error) {
      console.error('Error creating announcement:', error);
      setFormError('Failed to create announcement');
    }
  };

  const handleDeleteClick = (announcement: Announcement) => {
    setDeletingAnnouncement(announcement);
    setDeleteError(null);
    setDeleteSuccess(null);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAnnouncement = async () => {
    if (!deletingAnnouncement) return;

    setDeleteError(null);
    setDeleteSuccess(null);

    try {
      const result = await announcementService.deleteAnnouncement(
        deletingAnnouncement.id
      );

      if (result.success) {
        setDeleteSuccess('Announcement deleted successfully');
        // Refresh announcements
        fetchAnnouncements();

        // Close dialog after a short delay
        setTimeout(() => {
          setIsDeleteDialogOpen(false);
          setDeleteSuccess(null);
        }, 1500);
      } else {
        setDeleteError('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      setDeleteError('An unexpected error occurred');
    }
  };

  // Filter announcements based on active tab
  const filteredAnnouncements =
    activeTab === 'all'
      ? announcements
      : activeTab === 'important'
      ? announcements.filter((a) => a.important)
      : announcements.filter((a) => !a.important);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 p-6 md:p-8 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-green-500/20 rounded-xl"></div>
          <div className="absolute inset-0 bg-gray-800/90 backdrop-blur-sm rounded-xl"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  <Megaphone className="h-8 w-8 text-purple-400" />
                  Announcements
                </h1>
                <p className="text-gray-400 mt-2">
                  Stay updated with the latest news and information
                </p>
              </div>

              {canCreateAnnouncements && (
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-500">
                      <Plus className="mr-2 h-4 w-4" />
                      New Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Create Announcement</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Create a new announcement for all users
                      </DialogDescription>
                    </DialogHeader>

                    {formError && (
                      <Alert className="bg-red-900/20 border-red-900/30 text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{formError}</AlertDescription>
                      </Alert>
                    )}

                    {formSuccess && (
                      <Alert className="bg-green-900/20 border-green-900/30 text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{formSuccess}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="bg-gray-700 border-gray-600"
                          placeholder="Announcement title"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="bg-gray-700 border-gray-600 min-h-[120px]"
                          placeholder="Announcement details..."
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
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="border-gray-600 text-gray-300 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateAnnouncement}
                        className="bg-purple-600 hover:bg-purple-500"
                      >
                        Create Announcement
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </motion.div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-6"
        >
          <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              All Announcements
            </TabsTrigger>
            <TabsTrigger
              value="important"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Important
            </TabsTrigger>
            <TabsTrigger
              value="regular"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Regular
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <AnimatePresence>
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((announcement) => (
                  <motion.div
                    key={announcement.id}
                    variants={itemVariants}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <Card
                      className={`bg-gray-800/50 border-gray-700 overflow-hidden ${
                        announcement.important
                          ? 'border-l-4 border-l-amber-500'
                          : ''
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                              {announcement.title}
                              {announcement.important && (
                                <Badge className="bg-amber-500/20 text-amber-400 ml-2">
                                  Important
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="text-gray-400 flex items-center gap-1 mt-1">
                              <User className="h-3 w-3" />
                              {announcement.authorName} (
                              {announcement.authorRole})
                              <span className="mx-1">•</span>
                              <Calendar className="h-3 w-3" />
                              {formatDate(announcement.createdAt)}
                            </CardDescription>
                          </div>

                          {canCreateAnnouncements && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              onClick={() => handleDeleteClick(announcement)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 whitespace-pre-line">
                          {announcement.content}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Megaphone className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-400">
                    No announcements found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    {activeTab === 'all'
                      ? 'There are no announcements yet'
                      : `There are no ${activeTab} announcements`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this announcement? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <Alert className="bg-red-900/20 border-red-900/30 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          {deleteSuccess && (
            <Alert className="bg-green-900/20 border-green-900/30 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{deleteSuccess}</AlertDescription>
            </Alert>
          )}

          {deletingAnnouncement && (
            <div className="py-2">
              <p className="font-medium text-white">
                {deletingAnnouncement.title}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Posted by {deletingAnnouncement.authorName} on{' '}
                {formatDate(deletingAnnouncement.createdAt)}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAnnouncement}
              className="bg-red-600 hover:bg-red-500"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
