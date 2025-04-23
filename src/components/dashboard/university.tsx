"use client";

import { api } from "@/services/api";
import { getSearchParams } from "@/utils/paginationUtils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Table from "../table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export default function Users() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [tournaments, setTournaments] = useState<any[]>([]);

  // Define table columns
  const columns = [
    { accessorKey: "name", header: "TOURNAMENT NAME" },
    { accessorKey: "start_date", header: "START DATE" },
    { accessorKey: "end_date", header: "END DATE" },
    { accessorKey: "status", header: "STATUS" },
    { accessorKey: "teams_count", header: "TEAMS PARTICIPATING" },
    { accessorKey: "actions", header: "ACTIONS" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Draft</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await api.getTournaments();
        const formattedTournaments = response.tournaments.map((tournament: any) => ({
          name: tournament.name,
          start_date: new Date(tournament.start_date).toLocaleDateString(),
          end_date: new Date(tournament.end_date).toLocaleDateString(),
          status: getStatusBadge(tournament.status),
          teams_count: tournament.teams_count || 0,
          actions: (
            <div className="flex gap-2">
              {tournament.status === "draft" && (
                <Button onClick={() => handleJoinTournament(tournament.id)}>Join</Button>
              )}
              <Button onClick={() => handleViewTournament(tournament.id)}>View</Button>
            </div>
          ),
        }));
        setTournaments(formattedTournaments);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleJoinTournament = async (tournamentId: number) => {
    try {
      const teamId = 3; // Replace with actual team ID
      await api.registerTeamInTournament(tournamentId, teamId);
      // Refresh tournaments list
      const response = await api.getTournaments();
      const formattedTournaments = response.tournaments.map((tournament: any) => ({
        name: tournament.name,
        start_date: new Date(tournament.start_date).toLocaleDateString(),
        end_date: new Date(tournament.end_date).toLocaleDateString(),
        status: getStatusBadge(tournament.status),
        teams_count: tournament.teams_count || 0,
        actions: (
          <div className="flex gap-2">
            {tournament.status === "draft" && (
              <Button onClick={() => handleJoinTournament(tournament.id)}>Join</Button>
            )}
            <Button onClick={() => handleViewTournament(tournament.id)}>View</Button>
          </div>
        ),
      }));
      setTournaments(formattedTournaments);
    } catch (error) {
      console.error("Error joining tournament:", error);
    }
  };

  const handleViewTournament = (tournamentId: number) => {
    // Navigate to tournament details page
    window.location.href = `/dashboard/tournaments/${tournamentId}`;
  };

  useEffect(() => {
    const allParams = getSearchParams(searchParams);
    const page = Number(allParams.page) || 0;
    const size = Number(allParams.size) || 10;
    const search = allParams.search || "";

    setPage(page);
    setSize(size);
    setSearch(search);
  }, [searchParams]);

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-auto">
      <div className="w-full">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            rows={tournaments}
            loading={loading}
            size={size}
            page={page}
            totalRows={tournaments.length}
          />
        </div>
      </div>
    </div>
  );
}
