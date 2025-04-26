"use client";

import { api } from "@/services/api";
import { getSearchParams } from "@/utils/paginationUtils";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Table from "../table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Eye, List } from "lucide-react";
import { AppContext } from "@/context/app-context";

export default function Users() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const { user } = useContext(AppContext);
  const userRole = user?.role;
  const columns = [
    { accessorKey: "name", header: "TOURNAMENT NAME" },
    {
      accessorKey: "join",
      header: "JOIN",
      cell: ({ row }: { row: { original: any } }) => (
        <Button
          className="px-3 py-1 bg-secondary hover:bg-green-600 text-primary"
          onClick={() => handleJoinTournament(row.original.id)}
          disabled={userRole === "university_manager"}
        >
          Join
        </Button>
      ),
    },
    { accessorKey: "start_date", header: "START DATE" },
    { accessorKey: "end_date", header: "END DATE" },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }: { row: { original: any } }) =>
        getStatusBadge(row.original.status),
    },
    { accessorKey: "teams_count", header: "TEAMS PARTICIPATING" },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }: { row: { original: any } }) => (
        <Button
          className="border-0 hover:text-primary bg-transparent"
          variant={"outline"}
          onClick={() => handleViewTournament(row.original.id)}
        >
          <List />
          <span className="sr-only">View tournament</span>
        </Button>
      ),
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Draft
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
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTournaments = (data: any[]) => {
    return data.map((tournament: any, index: number) => ({
      id: tournament.id || index + 1,
      name: tournament.name,
      start_date: new Date(tournament.start_date).toLocaleDateString(),
      end_date: new Date(tournament.end_date).toLocaleDateString(),
      status: tournament.status,
      teams_count: tournament.teams_count || 0,
      details: (
        <div className="flex gap-2">
          {tournament.status === "draft" && (
            <Button onClick={() => handleJoinTournament(tournament.id)}>
              Join
            </Button>
          )}
          <Button onClick={() => handleViewTournament(tournament.id)}>
            View
          </Button>
        </div>
      ),
    }));
  };

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await api.getTournaments();
      setTournaments(formatTournaments(response.tournaments));
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTournament = async (tournamentId: number) => {
    try {
      const teamIdString = localStorage.getItem("teamId");

      if (!teamIdString) {
        console.error("No teamId found in localStorage.");
        return;
      }

      const teamId = parseInt(teamIdString, 10);

      if (isNaN(teamId)) {
        console.error("Invalid teamId stored in localStorage.");
        return;
      }

      await api.registerTeamInTournament(tournamentId, teamId);
      await fetchTournaments();
    } catch (error) {
      console.error("Error joining tournament:", error);
    }
  };

  const handleViewTournament = (tournamentId: number) => {
    window.location.href = `/dashboard/tournaments/${tournamentId}`;
  };

  useEffect(() => {
    const allParams = getSearchParams(searchParams);
    setPage(Number(allParams.page) || 0);
    setSize(Number(allParams.size) || 10);
    setSearch(allParams.search || "");
  }, [searchParams]);

  useEffect(() => {
    fetchTournaments();
  }, []);

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
