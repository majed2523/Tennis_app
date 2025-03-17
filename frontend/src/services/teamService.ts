// src/services/teamService.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export const teamService = {
  createTeam: async (teamName: string, coachId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${BASE_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ team_name: teamName, coach_id: coachId }),
      });
      return await res.json();
    } catch (error) {
      console.error('Error creating team:', error);
      return { error: 'Network error' };
    }
  },

  getTeam : async (teamId: number) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}/teams/${teamId}`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Backend Error:', errorData);
      throw new Error(errorData.error || 'Failed to fetch team details');
    }

    const team = await res.json();
    console.log("🔹 Team Data Received from API:", team); // Debugging output
    return team;
  } catch (error) {
    console.error('❌ Error fetching team:', error);
    return { error: 'Network error' };
  }
},

  getAllTeams: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${BASE_URL}/teams`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Backend Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch teams');
      }

      const teams = await res.json();
      console.log('🔹 All Teams Data:', teams); // Debugging output
      return teams;
    } catch (error) {
      console.error('❌ Error fetching teams:', error);
      return { error: 'Network error' };
    }
  },

  assignPlayerToTeam: async (teamId: string, playerId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${BASE_URL}/teams/${teamId}/players`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ player_id: playerId }),
      });
      return await res.json();
    } catch (error) {
      console.error('Error assigning player to team:', error);
      return { error: 'Network error' };
    }
  },

  getTeamMembers: async (teamId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${BASE_URL}/teams/${teamId}/players`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        return { error: `Request failed with status ${res.status}` };
      }

      return await res.json();
    } catch (error) {
      console.error('Error fetching team members:', error);
      return { error: 'Network error' };
    }
  },

  removePlayerFromTeam: async (teamId: string, playerId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(
        `${BASE_URL}/teams/${teamId}/players/${playerId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        return { error: data.error || 'Failed to remove player from team!' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing player from team:', error);
      return { error: 'Network error' };
    }
  },
};
