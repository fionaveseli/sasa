import { getRequest } from "@/utils/axios";

export const getTournamentDetails = (
  tournamentId: number,
  token: string
) => {
  return getRequest<{ tournament: any }>(`/api/tournaments/${tournamentId}/details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};