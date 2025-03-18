const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export const userService = {
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
      const res = await fetch(`${BASE_URL}/register`, {
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
      return await res.json();
    } catch (error) {
      console.error('Registration error:', error);
      return { error: 'Network error' };
    }
  },

  getAllPlayers: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${BASE_URL}/players`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        return { error: `Request failed with status ${res.status}` };
      }

      return await res.json();
    } catch (error) {
      console.error('Error fetching players:', error);
      return { error: 'Network error' };
    }
  },

  getAllCoaches: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${BASE_URL}/coaches`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        return { error: `Request failed with status ${res.status}` };
      }

      return await res.json();
    } catch (error) {
      console.error('Error fetching coaches:', error);
      return { error: 'Network error' };
    }
  },

  updateUser: async (userId: string, newId?: string, newPassword?: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { error: 'Unauthorized: No token found' };
      }

      const body: Record<string, string> = {};
      if (newId) body.new_id = newId;
      if (newPassword) body.new_password = newPassword;

      // If nothing to update, return early
      if (Object.keys(body).length === 0) {
        return { error: 'No updates provided' };
      }

      const res = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          error: errorData.error || `Request failed with status ${res.status}`,
        };
      }

      return await res.json();
    } catch (error) {
      console.error('Error updating user:', error);
      return { error: 'Network error' };
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { error: 'Unauthorized: No token found' };
      }

      const res = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          error: errorData.error || `Request failed with status ${res.status}`,
        };
      }

      return await res.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      return { error: 'Network error' };
    }
  },
};
