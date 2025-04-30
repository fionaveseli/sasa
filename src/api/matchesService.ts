import { ApiResponse } from "@/types/dto/Axios";
import { getRequest, patchRequest, postRequest } from "@/utils/axios";

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

  export const submitScore = async (
    matchId: number,
    scoreValue: number,
    proofImageUrl: string,
    token: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    return postRequest<{ success: boolean }, any>(
      `/api/matches/${matchId}/scores`,
      { score_value: scoreValue, proof_image_url: proofImageUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

export const updateMatchStatus = (
  matchId: number,
  status: "in_progress" | "completed" | "disputed",
  token: string
): Promise<ApiResponse<{ match: Match }>> =>
  patchRequest<{ match: Match }, { status: string }>(
    `/api/matches/${matchId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  export const resolveDispute = async (
  matchId: number,
  winnerTeamId: number
): Promise<any> => {
  const token = localStorage.getItem("token") || "";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/matches/${matchId}/resolve`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ winner_team_id: winnerTeamId }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to resolve match.");
  }

  return response.json();
};

