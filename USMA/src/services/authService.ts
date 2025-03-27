// src/services/authService.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export const authService = {
  login: async (userId: string, password: string) => {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, password }),
      });

      const data = await res.json();

      if (res.ok) {
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
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Network error' };
    }
  },

  register: async (
    firstName: string,
    lastName: string,
    password: string,
    role: string,
    adminToken: string
  ) => {
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          password,
          role,
        }),
      });
      return await res.json();
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'Network error' };
    }
  },

  getClientDetails: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${BASE_URL}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await res.json();
    } catch (error) {
      console.error('Error fetching client details:', error);
      return { error: 'Network error' };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.dispatchEvent(new Event('authChange'));
    return { success: true };
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
