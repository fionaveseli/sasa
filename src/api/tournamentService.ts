import axios, { getRequest } from "@/utils/axios";

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

export const submitScore = async (
  matchId: number,
  scoreValue: number,
  proofImage: File | null,
  token: string
) => {
  const formData = new FormData();
  formData.append("score_value", scoreValue.toString());
  if (proofImage) {
    formData.append("proof_image_url", proofImage); // backend expects this name
  }

  return axios.post(`/api/matches/${matchId}/scores`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};