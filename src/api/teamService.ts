import { getRequest, postRequest } from "@/utils/axios";
import { ApiResponse } from "@/types/dto/Axios";
import { CreateTeam, TeamResponse } from "@/types/dto/teams/Team";

export const createTeam = (
  data: CreateTeam
): Promise<ApiResponse<TeamResponse>> =>
  postRequest<TeamResponse, CreateTeam>("teams", data);

  export type Team = {
    id: number;
    name: string;
    university_id: number;
    status: string;
    created_by: number;
    createdAt: string;
    updatedAt: string;
    players: any[]; 
  };
  
  export const getUniversityTeams = (
    universityId: number,
    token: string
  ): Promise<{ data?: { teams: Team[] }; error?: any }> => {
    return getRequest<{ teams: Team[] }>(
      `api/university/${universityId}/teams`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
  