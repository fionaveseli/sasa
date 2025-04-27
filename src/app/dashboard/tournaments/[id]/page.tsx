"use client";

import { use, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getMatches } from "@/api/matchesService";
import { getTournamentDetails } from "@/api/tournamentService";

interface TournamentPageProps {
  params: Promise<{ id: string }>;
}
export default function TournamentDetails({ params }: TournamentPageProps) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [tournament, setTournament] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        const tournamentResponse = await getTournamentDetails(
          Number(id),
          token
        );
        const matchesResponse = await getMatches(Number(id), token);

        setTournament(tournamentResponse.data?.tournament ?? null);
        setMatches(matchesResponse.data?.matches ?? []);
      } catch (error) {
        console.error("Error fetching tournament details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!tournament) return <p>No tournament found.</p>;

  return (
    <div className="p-4 space-y-4">
      {/* Tournament Info */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{tournament.name}</h1>
        <Badge
          variant="outline"
          className={
            tournament.type === "university"
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-blue-100 text-blue-800 border-blue-300"
          }
        >
          {tournament.type === "university" ? "University" : "International"}
        </Badge>
      </div>

      <p>Start Date: {new Date(tournament.start_date).toLocaleDateString()}</p>
      <p>End Date: {new Date(tournament.end_date).toLocaleDateString()}</p>
      <p>Status: {tournament.status}</p>

      {/* Matches Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Matches</h2>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          {matches.map((match: any) => (
            <li key={match.id}>
              {match.team1?.name || `Team ${match.team1_id}`} vs{" "}
              {match.team2?.name || `Team ${match.team2_id}`} –{" "}
              <strong>
                {match.team1_score != null && match.team2_score != null
                  ? `${match.team1_score} - ${match.team2_score}`
                  : "Not played yet"}
              </strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
