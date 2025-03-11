import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Change this if your backend runs on a different port

// Helper function to get token
const getToken = () => localStorage.getItem('admin_token');

// ✅ Admin Login
export const adminLogin = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/admin/login`, {
    username,
    password,
  });
  return response.data;
};

// ✅ Manage Schedule (Admin 1)
export const manageSchedule = async (scheduleData: any) => {
  const token = getToken();
  if (!token) throw new Error('Unauthorized');

  const response = await axios.post(`${API_URL}/admin/schedule`, scheduleData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ✅ Manage Court Bookings (Admin 2)
export const manageCourtBookings = async (bookingData: any) => {
  const token = getToken();
  if (!token) throw new Error('Unauthorized');

  const response = await axios.post(`${API_URL}/admin/booking`, bookingData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ✅ Fetch Schedule (Admin 1)
export const fetchSchedule = async () => {
  const token = getToken();
  if (!token) throw new Error('Unauthorized');

  const response = await axios.get(`${API_URL}/admin/schedule`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ✅ Fetch Bookings (Admin 2)
export const fetchBookings = async () => {
  const token = getToken();
  if (!token) throw new Error('Unauthorized');

  const response = await axios.get(`${API_URL}/admin/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ✅ Fetch Admin Role
export const fetchAdminRole = () => {
  return localStorage.getItem('admin_role');
};
