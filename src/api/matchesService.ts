import { ApiResponse } from "@/types/dto/Axios";
import { getRequest } from "@/utils/axios";

export type Match = {
    id: number;
    tournament_id: number;
    round_number: number;
    match_number: number;
    team1_id: number;
    team2_id: number;
    status: "scheduled" | "in_progress" | "pending" | "disputed" | "completed";
    winner_id: number | null;
    next_match_id: number | null;
    team1?: {
      id: number;
      name: string;
    };
    team2?: {
      id: number;
      name: string;
    };
  };

  export const getMatches = (
    tournamentId: number,
    token: string
  ): Promise<ApiResponse<{ matches: Match[] }>> =>
    getRequest<{ matches: Match[] }>(`/api/tournaments/${tournamentId}/matches`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });