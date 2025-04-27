import axios from "axios";
import { toast } from "sonner";

// Add a variable to track if the toast has been shown
let hasShownTeamErrorToast = false;

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
  wins?: number;
  bio?: string;
  logo?: string;
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
  getCurrentTeam: async (): Promise<Team | null> => {
    try {
      const userResponse = await api.getCurrentUser();
      const universityId = userResponse.user?.university_id;
      const userRole = userResponse.user?.role;

      if (!universityId) {
        return null;
      }

      const response = await axios.get(
        `${API_BASE_URL}/university/${universityId}/teams`
      );

      if (!response.data.teams || response.data.teams.length === 0) {
        if (userRole === "university_manager") {
          return null;
        } else {
          // Only show the toast if it hasn't been shown before
          if (!hasShownTeamErrorToast) {
            toast.error("No teams found for this university");
            hasShownTeamErrorToast = true;
          }
          return null;
        }
      }

      const userEmail = userResponse.user.email;
      const userTeam = response.data.teams.find(
        (team: any) =>
          team.players &&
          team.players.some((player: any) => player.email === userEmail)
      );

      if (!userTeam) {
        if (userRole === "university_manager") {
          return null;
        } else {
          // Only show the toast if it hasn't been shown before
          if (!hasShownTeamErrorToast) {
            toast.error("User is not a member of any team");
            hasShownTeamErrorToast = true;
          }
          return null;
        }
      }

      // Reset the toast flag when a team is found
      hasShownTeamErrorToast = false;
      return userTeam;
    } catch (error) {
      console.error("Error fetching team:", error);
      // Only show the toast if it hasn't been shown before
      if (!hasShownTeamErrorToast) {
        toast.error("Failed to fetch team information");
        hasShownTeamErrorToast = true;
      }
      return null;
    }
  },

  createTeam: async (teamData: {
    name: string;
    bio?: string;
    logo?: string;
  }): Promise<Team> => {
    try {
      const userResponse = await api.getCurrentUser();
      console.log("User data for team creation:", userResponse);

      const universityId = userResponse.user?.university_id;
      console.log("University ID for team creation:", universityId);

      if (!universityId) {
        toast.error("User is not associated with a university");
        throw new Error("User is not associated with a university");
      }

      const response = await axios.post(`${API_BASE_URL}/teams`, {
        ...teamData,
        university_id: universityId,
      });

      console.log("Team creation response:", response.data);
      toast.success("Team created successfully!");
      return response.data;
    } catch (error) {
      console.error("Team creation error details:", error);
      toast.error("Failed to create team. Please try again.");
      throw error;
    }
  },

  joinTeam: async (teamId: number): Promise<Team> => {
    try {
      const userResponse = await api.getCurrentUser();
      console.log("User data for team joining:", userResponse);

      const response = await axios.post(`${API_BASE_URL}/teams/${teamId}/join`);
      console.log("Team join response:", response.data);

      toast.success("Successfully joined the team!");
      return response.data;
    } catch (error) {
      console.error("Error joining team:", error);
      toast.error("Failed to join team. Please try again.");
      throw error;
    }
  },

  leaveTeam: async (teamId: number): Promise<any> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/teams/${teamId}/leave`
      );
      console.log("Team leave response:", response.data);
      toast.success("Successfully left the team");
      return response.data;
    } catch (error) {
      console.error("Error leaving team:", error);
      toast.error("Failed to leave team. Please try again.");
      throw error;
    }
  },

  deleteTeam: async (teamId: number): Promise<any> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/teams/${teamId}`);
      console.log("Team delete response:", response.data);
      toast.success("Team deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team. Please try again.");
      throw error;
    }
  },

  // Tournament endpoints
  getCurrentTournament: async () => {
    const response = await axios.get(`${API_BASE_URL}/tournaments`);
    if (!response.data.tournaments || response.data.tournaments.length === 0) {
      return null;
    }
    return response.data.tournaments[0];
  },

  getTournamentMatches: async (tournamentId: number): Promise<Match[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/tournaments/${tournamentId}/matches`
    );
    return response.data.matches || [];
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const [userResponse, matchesResponse] = await Promise.all([
      api.getCurrentUser(),
      api
        .getCurrentTournament()
        .then((tournament) =>
          tournament ? api.getTournamentMatches(tournament.id) : []
        ),
    ]);

    const userTeam = await api.getCurrentTeam();
    const userTeams = userTeam ? [userTeam] : [];

    const totalMatches = matchesResponse.length;
    const userTeamIds = userTeams.map((team) => team.id);

    const wins = matchesResponse.filter(
      (match) => match.winner_id && userTeamIds.includes(match.winner_id)
    ).length;

    return {
      wins,
      totalMatches,
      tournaments: 1,
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
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tournaments`,
        tournamentData
      );
      toast.success("Tournament created successfully!");
      return response.data;
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast.error("Failed to create tournament. Please try again.");
      throw error;
    }
  },

  registerTeamInTournament: async (
    tournamentId: number,
    teamId: number
  ): Promise<any> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tournaments/${tournamentId}/register`,
        { team_id: teamId }
      );
      toast.success("Team successfully registered for tournament!");
      return response.data;
    } catch (error) {
      console.error("Error registering team for tournament:", error);
      toast.error("Failed to register team for tournament. Please try again.");
      throw error;
    }
  },

  updateTournamentStatus: async (
    tournamentId: number,
    status: string
  ): Promise<any> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tournaments/${tournamentId}/status`,
        { status }
      );
      toast.success(`Tournament status updated to: ${status}`);
      return response.data;
    } catch (error) {
      console.error("Error updating tournament status:", error);
      toast.error("Failed to update tournament status. Please try again.");
      throw error;
    }
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
    try {
      const response = await axios.post(
        `${API_BASE_URL}/uni/universities-r`,
        universityData
      );
      console.log(response);
      toast.success("University created successfully!");
      return response.data;
    } catch (error) {
      console.error("Error creating university:", error);
      toast.error("Failed to create university. Please try again.");
      throw error;
    }
  },

  joinUniversity: async (data: {
    university_id: number;
    email: string;
  }): Promise<{ message: string; user: any }> => {
    const response = await axios.post(`${API_BASE_URL}/uni/join`, data);
    toast.success("Successfully joined university!");
    return response.data;
  },

  // Image upload functions
  uploadLogo: async (logoFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append("logo", logoFile);

    const response = await axios.post(`${API_BASE_URL}/upload/logo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.file.url;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/change-password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  getUniversityUsers: async (universityId: number) => {
    const response = await axios.get(`${API_BASE_URL}/uni/universities/${universityId}/users`);
    return response.data;
  },  
};
