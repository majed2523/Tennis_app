const BASE_URL = 'http://127.0.0.1:5000';

// Authentication Service
export const authService = {
  login: async (userId: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, password }),
      });

      const data = await response.json();
      console.log('🔹 Login Response:', data, 'Status:', response.status);

      if (response.status !== 200) {
        console.log('❌ Backend Login Failed:', data.error);
        return { error: data.error || 'Login failed!' };
      }

      if (data.token) {
        localStorage.setItem('authToken', data.token);

        // Store user data
        const userData = {
          firstName: data.first_name || data.firstName || 'User',
          lastName: data.last_name || data.lastName || '',
          userId: data.user_id || userId,
          role: data.role || 'player',
        };

        localStorage.setItem('userData', JSON.stringify(userData));

        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('authChange'));
      }

      return data;
    } catch (error) {
      console.error('❌ Network Error:', error);
      return { error: 'Network error, please try again!' };
    }
  },

  // Admin-only registration function
  registerUser: async (
    firstName: string,
    lastName: string,
    password: string,
    role: string
  ) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { error: 'Unauthorized: No token found' };
    }

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          password,
          role,
        }),
      });

      const data = await response.json();
      console.log(
        '🔹 Registration Response:',
        data,
        'Status Code',
        response.status
      );

      if (response.status !== 201) {
        return { error: data.error || 'Registration failed!' };
      }

      return data;
    } catch (error) {
      console.error('❌ Network Error:', error);
      return { error: 'Network error, please try again!' };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  hasRole: (role: string) => {
    const userData = localStorage.getItem('userData');
    if (!userData) return false;

    try {
      const user = JSON.parse(userData);
      return user.role === role;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return false;
    }
  },
};

// Team Service
export const teamService = {
  createTeam: async (teamName: string, coachId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { error: 'Unauthorized: No token found' };
    }

    try {
      const response = await fetch(`${BASE_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          team_name: teamName,
          coach_id: coachId,
        }),
      });

      const data = await response.json();
      if (response.status !== 201) {
        return { error: data.error || 'Team creation failed!' };
      }

      return data;
    } catch (error) {
      console.error('❌ Network Error:', error);
      return { error: 'Network error, please try again!' };
    }
  },

  getTeam: async (teamId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/teams/${teamId}`, {
        method: 'GET',
      });

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching team:', error);
      return { error: 'Failed to fetch team' };
    }
  },

  getAllTeams: async () => {
    try {
      const response = await fetch(`${BASE_URL}/teams`, {
        method: 'GET',
      });

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching teams:', error);
      return { error: 'Failed to fetch teams' };
    }
  },
};

// Coach Availability Service
export const coachService = {
  addAvailability: async (
    coachId: string,
    day: string,
    startTime: string,
    endTime: string
  ) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { error: 'Unauthorized: No token found' };
    }

    try {
      const response = await fetch(`${BASE_URL}/coach/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coach_id: coachId,
          day,
          start_time: startTime,
          end_time: endTime,
        }),
      });

      const data = await response.json();
      if (response.status !== 201) {
        return { error: data.error || 'Failed to add availability!' };
      }

      return data;
    } catch (error) {
      console.error('❌ Network Error:', error);
      return { error: 'Network error, please try again!' };
    }
  },

  getAvailability: async (coachId: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/coach/availability/${coachId}`,
        {
          method: 'GET',
        }
      );

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching coach availability:', error);
      return { error: 'Failed to fetch coach availability' };
    }
  },
};

// Lesson Service
export const lessonService = {
  bookLesson: async (
    coachId: string,
    lessonDate: string,
    startTime: string,
    endTime: string
  ) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { error: 'Unauthorized: No token found' };
    }

    try {
      const response = await fetch(`${BASE_URL}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coach_id: coachId,
          lesson_date: lessonDate,
          start_time: startTime,
          end_time: endTime,
        }),
      });

      const data = await response.json();
      if (response.status !== 201) {
        return { error: data.error || 'Lesson booking failed!' };
      }

      return data;
    } catch (error) {
      console.error('❌ Network Error:', error);
      return { error: 'Network error, please try again!' };
    }
  },

  getPlayerLessons: async (userId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { error: 'Unauthorized: No token found' };
    }

    try {
      const response = await fetch(`${BASE_URL}/lessons/player/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching player lessons:', error);
      return { error: 'Failed to fetch player lessons' };
    }
  },

  getCoachLessons: async (coachId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { error: 'Unauthorized: No token found' };
    }

    try {
      const response = await fetch(`${BASE_URL}/lessons/coach/${coachId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching coach lessons:', error);
      return { error: 'Failed to fetch coach lessons' };
    }
  },
};
