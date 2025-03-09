const BASE_URL = 'http://127.0.0.1:5000';

const reservationService = {
  // Create a new reservation
  createReservation: async (reservationData: any) => {
    console.log('🔹 Sending Reservation Data:', reservationData);

    const token = localStorage.getItem('authToken'); // Get token from storage
    if (!token) {
      return { error: 'Unauthorized: No token found' };
    }

    try {
      const response = await fetch(`${BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach token to headers
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();
      console.log('🔹 Server Response:', data, 'Status Code:', response.status);

      if (response.status !== 201) {
        return { error: data.error || 'Reservation failed!' };
      }

      return data;
    } catch (error) {
      console.error('❌ Network Error:', error);
      return { error: 'Network error, please try again!' };
    }
  },

  // Get all reservations
  getAllReservations: async () => {
    try {
      const response = await fetch(`${BASE_URL}/reservations`, {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching reservations:', error);
      return { error: 'Failed to load reservations' };
    }
  },

  // Get reservations for a specific user (by phone number)
  getUserReservations: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { error: 'Unauthorized: No token found' };
    }

    try {
      const response = await fetch(`${BASE_URL}/reservations/client`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching user reservations:', error);
      return { error: 'Failed to load user reservations' };
    }
  },

  // Delete a reservation
  deleteReservation: async (reservationId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { error: 'Unauthorized: No token found' };
    }

    try {
      const response = await fetch(
        `${BASE_URL}/reservations/${reservationId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return await response.json();
    } catch (error) {
      console.error('❌ Error deleting reservation:', error);
      return { error: 'Failed to delete reservation' };
    }
  },
};

export default reservationService;
