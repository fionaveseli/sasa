import { postRequest } from "@/utils/axios";
import { ApiResponse } from "@/types/dto/Axios";
import { CreateTeam, TeamResponse } from "@/types/dto/teams/Team";

export const createTeam = (
  data: CreateTeam
): Promise<ApiResponse<TeamResponse>> =>
  postRequest<TeamResponse, CreateTeam>("teams", data);
