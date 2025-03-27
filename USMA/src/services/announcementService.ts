// src/services/announcementService.ts

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  important: boolean;
  createdAt: string;
}

// Helper function to generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Initialize with some sample announcements if none exist
const initializeAnnouncements = (): void => {
  if (typeof window === 'undefined') return;

  const storedAnnouncements = localStorage.getItem('announcements');
  if (!storedAnnouncements) {
    const sampleAnnouncements: Announcement[] = [
      {
        id: generateId(),
        title: 'Welcome to Tennis Club Management',
        content:
          'Welcome to our new tennis club management system. This platform will help you manage your lessons, teams, and availability.',
        authorName: 'Admin',
        authorRole: 'admin',
        important: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Court Maintenance Schedule',
        content:
          'Courts 3 and 4 will be under maintenance next weekend. Please adjust your schedules accordingly.',
        authorName: 'Facility Manager',
        authorRole: 'admin',
        important: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: generateId(),
        title: 'Summer Tournament Registration Open',
        content:
          'Registration for the summer tournament is now open. Please register by June 15th to participate.',
        authorName: 'Tournament Director',
        authorRole: 'admin',
        important: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
    ];

    localStorage.setItem('announcements', JSON.stringify(sampleAnnouncements));
  }
};

export const announcementService = {
  getAllAnnouncements: (): Announcement[] => {
    if (typeof window === 'undefined') return [];

    initializeAnnouncements();
    const storedAnnouncements = localStorage.getItem('announcements');
    return storedAnnouncements ? JSON.parse(storedAnnouncements) : [];
  },

  createAnnouncement: (
    title: string,
    content: string,
    important: boolean
  ): Announcement => {
    if (typeof window === 'undefined')
      throw new Error('Cannot create announcement on server side');

    initializeAnnouncements();

    // Get current user info
    const userDataStr = localStorage.getItem('userData');
    const userData = userDataStr
      ? JSON.parse(userDataStr)
      : { firstName: 'Unknown', lastName: 'User', role: 'coach' };

    const newAnnouncement: Announcement = {
      id: generateId(),
      title,
      content,
      authorName: `${userData.firstName} ${userData.lastName}`,
      authorRole: userData.role,
      important,
      createdAt: new Date().toISOString(),
    };

    const announcements = announcementService.getAllAnnouncements();
    announcements.unshift(newAnnouncement);
    localStorage.setItem('announcements', JSON.stringify(announcements));

    return newAnnouncement;
  },

  deleteAnnouncement: (id: string): { success: boolean } => {
    if (typeof window === 'undefined') return { success: false };

    const announcements = announcementService.getAllAnnouncements();
    const filteredAnnouncements = announcements.filter((a) => a.id !== id);

    if (filteredAnnouncements.length === announcements.length) {
      return { success: false };
    }

    localStorage.setItem(
      'announcements',
      JSON.stringify(filteredAnnouncements)
    );
    return { success: true };
  },
};
