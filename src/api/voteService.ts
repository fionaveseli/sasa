import { getRequest } from "@/utils/axios";
import { TournamentVote } from "@/types/dto/votes/TournamentVotes";
import { ApiResponse } from "@/types/dto/Axios";

export const getTournamentVotes = (
    tournamentId: number
): Promise<ApiResponse<TournamentVote[]>> =>
    getRequest<TournamentVote[]>(`api/tournaments/${tournamentId}/votes`);
