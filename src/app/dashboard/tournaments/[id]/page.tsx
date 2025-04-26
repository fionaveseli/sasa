"use client";
import { useEffect, useState } from "react";

interface TournamentPageProps {
  params: { id: string };
}

export default function TournamentDetails({ params }: TournamentPageProps) {
  const { id } = params;
  const [tournament, setTournament] = useState<any>(null);

  useEffect(() => {
    // Mocked tournament data
    const mockTournament = {
      id,
      name: `Mock Tournament #${id}`,
      start_date: "2025-05-01",
      end_date: "2025-05-10",
      status: "in_progress",
      matches: [
        { matchId: 1, teamA: "Alpha", teamB: "Beta", score: "2 - 1" },
        { matchId: 2, teamA: "Gamma", teamB: "Delta", score: "0 - 0" },
      ],
    };

    setTournament(mockTournament);
  }, [id]);

  if (!tournament) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{tournament.name}</h1>
      <p>Start: {tournament.start_date}</p>
      <p>End: {tournament.end_date}</p>
      <p>Status: {tournament.status}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Matches</h2>
        <ul className="list-disc pl-6 mt-2">
          {tournament.matches.map((match: any) => (
            <li key={match.matchId}>
              {match.teamA} vs {match.teamB} – <strong>{match.score}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
