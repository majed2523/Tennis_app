// src/services/coachService.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export const coachService = {
  addAvailability: async (
    coachId: string,
    day: string,
    startTime: string,
    endTime: string
  ) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${BASE_URL}/coach/availability`, {
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
      return await res.json();
    } catch (error) {
      console.error('Error adding availability:', error);
      return { error: 'Network error' };
    }
  },

  getAvailability: async (coachId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${BASE_URL}/coach/availability/${coachId}`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        return { error: `Request failed with status ${res.status}` };
      }

      return await res.json();
    } catch (error) {
      console.error('Error fetching availability:', error);
      return { error: 'Network error' };
    }
  },
};
