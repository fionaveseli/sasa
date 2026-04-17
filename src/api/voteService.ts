import axiosInstance from "@/utils/axios";
import { TournamentVote } from "@/types/dto/votes/TournamentVotes";

export const getTournamentVotes = async (
  tournamentId: number,
): Promise<TournamentVote[]> => {
  const response = await axiosInstance.get(
    `/tournaments/${tournamentId}/votes`,
  );
  return response.data;
};
