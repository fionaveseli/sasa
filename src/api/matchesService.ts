import { getRequest, patchRequest, postRequest } from "@/utils/axios";
import { ApiResponse } from "@/types/dto/Axios";

// Match type for match-level operations (lighter than the full tournament Match)
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
  team1?: { id: number; name: string };
  team2?: { id: number; name: string };
  scores?: { score_value: number; team_id: number; status: string }[];
};

// GET /tournaments/:id/matches — backend returns array directly
export const getMatches = (
  tournamentId: number,
): Promise<ApiResponse<Match[]>> =>
  getRequest<Match[]>(`/tournaments/${tournamentId}/matches`);

// POST /matches/:id/scores
export const submitScore = (
  matchId: number,
  scoreValue: number,
  proofImageUrl: string,
): Promise<ApiResponse<{ success: boolean }>> =>
  postRequest<{ success: boolean }, object>(`/matches/${matchId}/scores`, {
    score_value: scoreValue,
    proof_image_url: proofImageUrl,
  });

// PATCH /matches/:id/status
export const updateMatchStatus = (
  matchId: number,
  status: "in_progress" | "completed" | "disputed",
): Promise<ApiResponse<{ match: Match }>> =>
  patchRequest<{ match: Match }, { status: string }>(
    `/matches/${matchId}/status`,
    { status },
  );

// PATCH /matches/:id/resolve
export const resolveDispute = (
  matchId: number,
  winnerTeamId: number,
): Promise<ApiResponse<any>> =>
  patchRequest<any, { winner_team_id: number }>(`/matches/${matchId}/resolve`, {
    winner_team_id: winnerTeamId,
  });
