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

  updateUser: async (userId: number, newId?: number, newPassword?: string) => {
     try {
       const token = localStorage.getItem('authToken');
       const headers: Record<string, string> = {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
       };

       const body: any = {};
       if (newId) body.new_id = newId;
       if (newPassword) body.new_password = newPassword;

       const res = await fetch(`${BASE_URL}/user/${userId}`, {
         method: 'PUT',
         headers,
         body: JSON.stringify(body),
       });

       if (!res.ok) throw new Error('Failed to update user');
       return await res.json();
     } catch (error) {
       console.error('Error updating user:', error);
       return { error: 'Network error' };
     }
  },

  deleteUser: async (userId: number) => {
     try {
       const token = localStorage.getItem('authToken');
       const headers: Record<string, string> = {
         Authorization: `Bearer ${token}`,
       };

       const res = await fetch(`${BASE_URL}/user/${userId}`, {
         method: 'DELETE',
         headers,
       });

       if (!res.ok) throw new Error('Failed to delete user');
       return await res.json();
     } catch (error) {
       console.error('Error deleting user:', error);
       return { error: 'Network error' };
     }
  },
};
