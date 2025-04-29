import { ApiResponse } from "@/types/dto/Axios";
import { getRequest, postRequest } from "@/utils/axios";

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

export const submitScore = (
  matchId: number,
  score: number,
  proofImage: File | null,
  token: string
): Promise<ApiResponse<{ success: boolean }>> => {
  const formData = new FormData();
  formData.append("score_value", score.toString());
  if (proofImage) {
    formData.append("proof_image", proofImage);
  }

  return postRequest<{ success: boolean }, FormData>(
    `/api/matches/${matchId}/scores`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
