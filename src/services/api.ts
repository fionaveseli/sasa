import axios from "axios";

const API_BASE_URL = "https://web-production-3dd4c.up.railway.app/api";

// Add auth token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DashboardStats {
  wins: number;
  totalMatches: number;
  tournaments: number;
}

export interface Match {
  id: number;
  tournament_id: number;
  team1_id: number;
  team2_id: number;
  scheduled_time: string;
  round_number: number;
  match_number: number;
  status: string;
  winner_id: number | null;
  next_match_id: number | null;
  team1: {
    id: number;
    name: string;
    university_id: number;
    status: string;
    created_by: number;
  };
  team2: {
    id: number;
    name: string;
    university_id: number;
    status: string;
    created_by: number;
  };
  winner: {
    id: number;
    name: string;
    university_id: number;
    status: string;
    created_by: number;
  } | null;
  Scores: {
    id: number;
    match_id: number;
    team_id: number;
    score_value: number;
    status: string;
  }[];
}

export interface Team {
  id: number;
  name: string;
  university_id: number;
  status: string;
  created_by: number;
  // Additional properties that might be returned by API
  wins?: number;
  bio?: string;
  players: {
    id: number;
    fullName: string;
    email: string;
  }[];
}

export interface BracketRound {
  title: string;
  seeds: {
    id: number;
    teams: { name: string }[];
  }[];
}

export interface University {
  id: number;
  name: string;
  email_domain: string;
  location: string;
  contact_info: string;
  logo: string | null;
  banner_color: string;
  bio: string;
  manager_id: number;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  // User endpoints
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData: {
    fullName: string;
    email: string;
    password: string;
    graduationYear: string;
    timeZone: string;
  }) => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData
    );
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axios.get(`${API_BASE_URL}/users/me`);
    return response.data;
  },

  // Team endpoints
  getCurrentTeam: async (): Promise<Team> => {
    // First get the current user to get their university_id
    try {
      const userResponse = await api.getCurrentUser();
      console.log("User data for team retrieval:", userResponse);

      // The university_id might be nested in the user object
      const universityId = userResponse.user?.university_id;
      console.log("University ID for team retrieval:", universityId);

      if (!universityId) {
        throw new Error("User is not associated with a university");
      }

      const response = await axios.get(
        `${API_BASE_URL}/university/${universityId}/teams`
      );

      if (!response.data.teams || response.data.teams.length === 0) {
        throw new Error("No teams found for this university");
      }

      // Find the team that the user is a member of
      const userEmail = userResponse.user.email;
      const userTeam = response.data.teams.find(
        (team: any) =>
          team.players &&
          team.players.some((player: any) => player.email === userEmail)
      );

      if (!userTeam) {
        throw new Error("User is not a member of any team");
      }

      return userTeam;
    } catch (error) {
      console.error("Error getting current team:", error);
      throw error;
    }
  },

  createTeam: async (teamData: { name: string }): Promise<Team> => {
    // First get the current user to get their university_id
    try {
      const userResponse = await api.getCurrentUser();
      console.log("User data for team creation:", userResponse);

      // The university_id might be nested in the user object
      const universityId = userResponse.user?.university_id;
      console.log("University ID for team creation:", universityId);

      if (!universityId) {
        throw new Error("User is not associated with a university");
      }

      // Based on error, the correct endpoint might be different
      // Try the following endpoint format instead
      const response = await axios.post(`${API_BASE_URL}/teams`, {
        ...teamData,
        university_id: universityId,
      });

      console.log("Team creation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Team creation error details:", error);
      throw error;
    }
  },

  joinTeam: async (teamId: number): Promise<Team> => {
    try {
      const userResponse = await api.getCurrentUser();
      console.log("User data for team joining:", userResponse);

      // Send request to join team
      const response = await axios.post(`${API_BASE_URL}/teams/${teamId}/join`);

      console.log("Team join response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error joining team:", error);
      throw error;
    }
  },

  leaveTeam: async (teamId: number): Promise<any> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/teams/${teamId}/leave`
      );
      console.log("Team leave response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error leaving team:", error);
      throw error;
    }
  },

  deleteTeam: async (teamId: number): Promise<any> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/teams/${teamId}`);
      console.log("Team delete response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting team:", error);
      throw error;
    }
  },

  // Tournament endpoints
  getCurrentTournament: async () => {
    const response = await axios.get(`${API_BASE_URL}/tournaments`);
    if (!response.data.tournaments || response.data.tournaments.length === 0) {
      return null;
    }
    return response.data.tournaments[0]; // Get the first tournament for now
  },

  getTournamentMatches: async (tournamentId: number): Promise<Match[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/tournaments/${tournamentId}/matches`
    );
    return response.data.matches || [];
  },

  // Dashboard specific endpoints
  getDashboardStats: async (): Promise<DashboardStats> => {
    const [userResponse, matchesResponse] = await Promise.all([
      api.getCurrentUser(),
      api
        .getCurrentTournament()
        .then((tournament) =>
          tournament ? api.getTournamentMatches(tournament.id) : []
        ),
    ]);

    const userTeams = await api
      .getCurrentTeam()
      .then((team) => [team])
      .catch(() => []);

    const totalMatches = matchesResponse.length;
    const userTeamIds = userTeams.map((team) => team.id);

    // Count matches where the user's team is the winner
    const wins = matchesResponse.filter(
      (match) => match.winner_id && userTeamIds.includes(match.winner_id)
    ).length;

    return {
      wins,
      totalMatches,
      tournaments: 1, // For now, we'll just show 1 tournament
    };
  },

  getUpcomingMatches: async (): Promise<Match[]> => {
    const tournament = await api.getCurrentTournament();
    if (!tournament) return [];

    const matches = await api.getTournamentMatches(tournament.id);
    return matches.filter(
      (match) =>
        new Date(match.scheduled_time) > new Date() &&
        match.status === "scheduled"
    );
  },

  getTournamentBracket: async (): Promise<BracketRound[]> => {
    const tournament = await api.getCurrentTournament();
    if (!tournament) return [];

    const matches = await api.getTournamentMatches(tournament.id);

    // Group matches by round
    const rounds = matches.reduce((acc: any, match) => {
      if (!acc[match.round_number]) {
        acc[match.round_number] = {
          title: `Round ${match.round_number}`,
          seeds: [],
        };
      }

      acc[match.round_number].seeds.push({
        id: match.id,
        teams: [{ name: match.team1.name }, { name: match.team2.name }],
      });

      return acc;
    }, {});

    return Object.values(rounds);
  },

  createTournament: async (tournamentData: {
    name: string;
    type: string;
    registration_deadline: string;
    start_date: string;
    end_date: string;
    university_id: number;
    bracket_type: string;
    description: string;
    rules: string;
    time_zone: string;
  }): Promise<any> => {
    const response = await axios.post(
      `${API_BASE_URL}/tournaments`,
      tournamentData
    );
    return response.data;
  },

  registerTeamInTournament: async (
    tournamentId: number,
    teamId: number
  ): Promise<any> => {
    const response = await axios.post(
      `${API_BASE_URL}/tournaments/${tournamentId}/register`,
      { team_id: teamId }
    );
    return response.data;
  },

  updateTournamentStatus: async (
    tournamentId: number,
    status: string
  ): Promise<any> => {
    const response = await axios.post(
      `${API_BASE_URL}/tournaments/${tournamentId}/status`,
      { status }
    );
    return response.data;
  },

  getTournaments: async (): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/tournaments`);
    return response.data;
  },

  // University endpoints
  getUniversities: async (): Promise<University[]> => {
    const response = await axios.get(`${API_BASE_URL}/uni/universities-g`);
    return response.data.universities;
  },

  getUniversityTeams: async (universityId: number): Promise<Team[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/university/${universityId}/teams`
    );
    return response.data.teams || [];
  },

  getUniversityById: async (id: number): Promise<University> => {
    const response = await axios.get(
      `${API_BASE_URL}/uni/universities-g/${id}`
    );
    return response.data.university;
  },

  createUniversity: async (universityData: {
    universityName: string;
    universityAddress: string;
    contactNumber: string;
    logo?: string;
    bannerColor: string;
    bio: string;
  }): Promise<{ university: University; user: any }> => {
    const response = await axios.post(
      `${API_BASE_URL}/uni/universities-r`,
      universityData
    );
    return response.data;
  },

  joinUniversity: async (data: {
    university_id: number;
    email: string;
  }): Promise<{ message: string; user: any }> => {
    const response = await axios.post(`${API_BASE_URL}/uni/join`, data);
    return response.data;
  },
};
