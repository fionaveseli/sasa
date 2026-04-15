import axiosInstance from "@/utils/axios";
import { toast } from "sonner";

export interface Team {
  id: number;
  name: string;
  universityId: number;
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

// Module-level flag to avoid repeated toasts for the same state
let hasShownTeamErrorToast = false;

export const createTeam = async (teamData: {
  name: string;
  bio?: string;
  logo?: string;
}): Promise<Team> => {
  const userResponse = await axiosInstance.get("/users/me");
  const universityId = userResponse.data.user?.universityId;

  if (!universityId) {
    toast.error("User is not associated with a university");
    throw new Error("User is not associated with a university");
  }

  const response = await axiosInstance.post("/teams", {
    ...teamData,
    universityId,
  });

  toast.success("Team created successfully!");
  return response.data;
};

export const joinTeam = async (teamId: number): Promise<Team> => {
  const response = await axiosInstance.post(`/teams/${teamId}/join`);
  toast.success("Successfully joined the team!");
  return response.data;
};

export const leaveTeam = async (teamId: number) => {
  const response = await axiosInstance.post(`/teams/${teamId}/leave`);
  toast.success("Successfully left the team");
  return response.data;
};

export const deleteTeam = async (teamId: number) => {
  const response = await axiosInstance.delete(`/teams/${teamId}`);
  toast.success("Team deleted successfully");
  return response.data;
};

export const getCurrentTeam = async (): Promise<Team | null> => {
  try {
    const userResponse = await axiosInstance.get("/users/me");
    const universityId = userResponse.data.user?.universityId;
    const userRole = userResponse.data.user?.role;
    const userEmail = userResponse.data.user?.email;

    if (!universityId) return null;

    const teamsResponse = await axiosInstance.get(
      `/universities/${universityId}/teams`,
    );
    const teams: Team[] = teamsResponse.data.teams || [];

    if (teams.length === 0) {
      if (userRole !== "university_manager" && !hasShownTeamErrorToast) {
        toast.error("No teams found for this university");
        hasShownTeamErrorToast = true;
      }
      return null;
    }

    const userTeam = teams.find(
      (team) =>
        team.players &&
        team.players.some((player) => player.email === userEmail),
    );

    if (!userTeam) {
      if (userRole !== "university_manager" && !hasShownTeamErrorToast) {
        toast.error("User is not a member of any team");
        hasShownTeamErrorToast = true;
      }
      return null;
    }

    hasShownTeamErrorToast = false;
    return userTeam;
  } catch (error) {
    console.error("Error fetching team:", error);
    if (!hasShownTeamErrorToast) {
      toast.error("Failed to fetch team information");
      hasShownTeamErrorToast = true;
    }
    return null;
  }
};
