// src/services/lessonService.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export const lessonService = {
  bookLesson: async (
    coachId: string,
    lessonDate: string,
    startTime: string,
    endTime: string
  ) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${BASE_URL}/lessons`, {
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
      return await res.json();
    } catch (error) {
      console.error('Error booking lesson:', error);
      return { error: 'Network error' };
    }
  },

  getPlayerLessons: async (playerId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${BASE_URL}/lessons/player/${playerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await res.json();
    } catch (error) {
      console.error('Error fetching player lessons:', error);
      return { error: 'Network error' };
    }
  },

  getCoachLessons: async (coachId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${BASE_URL}/lessons/coach/${coachId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await res.json();
    } catch (error) {
      console.error('Error fetching coach lessons:', error);
      return { error: 'Network error' };
    }
  },
};
