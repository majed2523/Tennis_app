const BASE_URL = 'http://127.0.0.1:5000';

const clientService = {
  // ✅ Register a new client (Matches your original order)
  registerClient: async (
    phoneNumber: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    console.log('🔹 Sending Registration Data:', {
      phone_number: phoneNumber,
      first_name: firstName,
      last_name: lastName,
      password,
    });

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber,
          first_name: firstName,
          last_name: lastName,
          password,
        }),
      });

      const data = await response.json();
      console.log('🔹 Server Response:', data, 'Status Code', response.status);

      if (response.status !== 201) {
        return { error: data.error || 'Registration failed!' };
      }

      return data;
    } catch (error) {
      console.error('❌ Network Error:', error);
      return { error: 'Network error, please try again!' };
    }
  },

  // ✅ Login client (Matches your original order)
  loginClient: async (phoneNumber: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, password }),
      });

      const data = await response.json();

      console.log('🔹 Login Response:', data, 'Status:', response.status);

      if (response.status !== 200) {
        console.log('❌ Backend Login Failed:', data.error);
        return { error: data.error || 'Login failed!' }; // ✅ Return error properly
      }

      if (data.token) {
        localStorage.setItem('authToken', data.token); // ✅ Save token on success
      }

      return data;
    } catch (error) {
      console.error('❌ Network Error:', error);
      return { error: 'Network error, please try again!' };
    }
  },

  // ✅ Get authenticated client details
  getClientDetails: async () => {
    const token = localStorage.getItem('authToken'); // ✅ Ensure token is stored
    if (!token) {
      console.log('❌ No token found. Redirecting to login.');
      return { error: 'No token found. Please log in.' };
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/client', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Fix: Use "Bearer" prefix
          'Content-Type': 'application/json',
        },
      });

      console.log('🔹 Client Details Response:', response);

      if (!response.ok) {
        console.log('❌ Unauthorized access. Clearing token.');
        localStorage.removeItem('authToken'); // ✅ Clear token if unauthorized
        return { error: 'Unauthorized' };
      }

      const data = await response.json();

      // Store user data from API response
      if (data && data.first_name && data.last_name) {
        const userData = {
          firstName: data.first_name,
          lastName: data.last_name,
          phone_number: data.phone_number,
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('🔹 Updated user data from API:', userData);
      }

      return data;
    } catch (error) {
      console.error('❌ Network Error:', error);
      return { error: 'Network error, please try again!' };
    }
  },

  // ✅ Logout (remove token)
  logoutClient: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },

  // ✅ Delete client account
  deleteClient: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return { error: 'No token found. Please log in.' };

    try {
      const response = await fetch(`${BASE_URL}/client`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      clientService.logoutClient(); // Remove token after deleting account
      return await response.json();
    } catch (error) {
      console.error('❌ Network Error:', error);
      return { error: 'Network error, please try again!' };
    }
  },

  // ✅ Update client phone number
  updateClientPhone: async (clientId: number, phoneNumber: string) => {
    try {
      const response = await fetch(`${BASE_URL}/client/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Update error:', error);
      return { error: 'Failed to update phone number' };
    }
  },
};

export default clientService;
