"use client";

import { use, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getMatches } from "@/api/matchesService";
import { getTournamentDetails } from "@/api/tournamentService";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";

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
    const fetchTournamentAndMatches = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        const tournamentResponse = await getTournamentDetails(
          Number(id),
          token
        );
        const matchesResponse = await getMatches(Number(id), token);

        setTournament(tournamentResponse.data?.tournament ?? null);
        setMatches(formatMatches(matchesResponse.data?.matches ?? []));
      } catch (error) {
        console.error("Error fetching tournament or matches", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentAndMatches();
  }, [id]);

  const formatMatches = (data: any[]) => {
    return data.map((match: any, index: number) => ({
      id: match.id || index + 1,
      round_number: match.round_number,
      match_number: match.match_number,
      team1_name: match.team1?.name || `Team ${match.team1_id}`,
      team2_name: match.team2?.name || `Team ${match.team2_id}`,
      status: match.status,
      winner_name: match.winner?.name || "-",
    }));
  };

  const handleViewMatch = (matchId: number) => {
    window.location.href = `/dashboard/matches/${matchId}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Scheduled
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-orange-100 text-orange-800 border-orange-200"
          >
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Completed
          </Badge>
        );
      case "disputed":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-200"
          >
            Disputed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    { accessorKey: "id", header: "MATCH ID" },
    { accessorKey: "round_number", header: "ROUND" },
    { accessorKey: "match_number", header: "MATCH #" },
    { accessorKey: "team1_name", header: "TEAM 1" },
    { accessorKey: "team2_name", header: "TEAM 2" },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }: { row: { original: any } }) =>
        getStatusBadge(row.original.status),
    },
    {
      accessorKey: "winner_name",
      header: "WINNER",
    },
    {
      accessorKey: "details",
      header: "DETAILS",
      cell: ({ row }: { row: { original: any } }) => (
        <Button
          className="border-0 hover:text-primary bg-transparent"
          variant="outline"
          onClick={() => handleViewMatch(row.original.id)}
        >
          <List />
          <span className="sr-only">View match</span>
        </Button>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (!tournament) return <p>No tournament found.</p>;

  return (
    <div className="w-full flex flex-col gap-6 p-4">
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
      <div className="w-full mt-6">
        <h2 className="text-xl font-semibold mb-4">Matches</h2>
        <Table
          columns={columns}
          rows={matches}
          loading={loading}
          size={10}
          page={0}
          totalRows={matches.length}
        />
      </div>
    </div>
  );
}
