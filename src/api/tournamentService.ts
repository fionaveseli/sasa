import axiosInstance from "@/utils/axios";
import { toast } from "sonner";

// Match is the canonical type for match data across the app
export interface Match {
  id: number;
  tournament_id: number;
  team1_id: number;
  team2_id: number;
  scheduled_time: string;
  round_number: number;
  match_number: number;
  status: string;
  winner_id: number | null;
  next_match_id: number | null;
  team1: {
    id: number;
    name: string;
    universityId: number;
    status: string;
    created_by: number;
  };
  team2: {
    id: number;
    name: string;
    universityId: number;
    status: string;
    created_by: number;
  };
  winner: {
    id: number;
    name: string;
    universityId: number;
    status: string;
    created_by: number;
  } | null;
  Scores: {
    id: number;
    match_id: number;
    team_id: number;
    score_value: number;
    status: string;
  }[];
}

export interface DashboardStats {
  wins: number;
  totalMatches: number;
  tournaments: number;
}

export interface BracketRound {
  title: string;
  seeds: {
    id: number;
    teams: { name: string }[];
  }[];
}

export const getTournaments = async (universityId: number) => {
  const response = await axiosInstance.get(
    `/universities/${universityId}/tournaments`,
  );
  return response.data;
};

export const getCurrentTournament = async () => {
  const response = await axiosInstance.get("/tournaments");
  if (!response.data.tournaments || response.data.tournaments.length === 0) {
    return null;
  }
  return response.data.tournaments[0];
};

export const createTournament = async (data: {
  name: string;
  type: string;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  universityId: number;
  bracketType: string;
  description: string;
  rules: string;
  timeZone: string;
}) => {
  // Transform camelCase frontend fields to snake_case for the backend
  const payload = {
    name: data.name,
    type: data.type,
    registration_deadline: data.registrationDeadline,
    start_date: data.startDate,
    end_date: data.endDate,
    universityId: data.universityId,
    bracket_type: data.bracketType,
    description: data.description,
    rules: data.rules,
    time_zone: data.timeZone,
  };

  const response = await axiosInstance.post("/tournaments", payload);
  toast.success("Tournament created successfully!");
  return response.data;
};

export const registerTeamInTournament = async (
  tournamentId: number,
  teamId: number,
) => {
  const response = await axiosInstance.post(
    `/tournaments/${tournamentId}/register`,
    { team_id: teamId },
  );
  toast.success("Team successfully registered for tournament!");
  return response.data;
};

export const updateTournamentStatus = async (
  tournamentId: number,
  status: string,
) => {
  const response = await axiosInstance.patch(
    `/tournaments/${tournamentId}/status`,
    { status },
  );
  toast.success(`Tournament status updated to: ${status}`);
  return response.data;
};

export const getTournamentMatches = async (
  tournamentId: number,
): Promise<Match[]> => {
  const response = await axiosInstance.get(
    `/tournaments/${tournamentId}/matches`,
  );
  return response.data;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const tournament = await getCurrentTournament();
  const matchesData: Match[] = tournament
    ? await getTournamentMatches(tournament.id)
    : [];

  let userTeamIds: number[] = [];
  try {
    const userResponse = await axiosInstance.get("/users/me");
    const universityId = userResponse.data.user?.universityId;
    const userEmail = userResponse.data.user?.email;

    if (universityId) {
      const teamsResponse = await axiosInstance.get(
        `/universities/${universityId}/teams`,
      );
      const teams = teamsResponse.data.teams || [];
      const userTeam = teams.find((team: any) =>
        team.players?.some((player: any) => player.email === userEmail),
      );
      if (userTeam) {
        userTeamIds = [userTeam.id];
      }
    }
  } catch {
    // proceed with empty team ids
  }

  const totalMatches = matchesData.length;
  const wins = matchesData.filter(
    (match) => match.winner_id && userTeamIds.includes(match.winner_id),
  ).length;

  return { wins, totalMatches, tournaments: 1 };
};

export const getUpcomingMatches = async (): Promise<Match[]> => {
  const tournament = await getCurrentTournament();
  if (!tournament) return [];

  const matches = await getTournamentMatches(tournament.id);
  return matches.filter(
    (match) =>
      new Date(match.scheduled_time) > new Date() &&
      match.status === "scheduled",
  );
};

export const getTournamentBracket = async (): Promise<BracketRound[]> => {
  const tournament = await getCurrentTournament();
  if (!tournament) return [];

  const matches = await getTournamentMatches(tournament.id);

  const rounds = matches.reduce((acc: Record<number, BracketRound>, match) => {
    if (!acc[match.round_number]) {
      acc[match.round_number] = {
        title: `Round ${match.round_number}`,
        seeds: [],
      };
    }
    acc[match.round_number].seeds.push({
      id: match.id,
      teams: [{ name: match.team1?.name }, { name: match.team2?.name }],
    });
    return acc;
  }, {});

  return Object.values(rounds);
};
