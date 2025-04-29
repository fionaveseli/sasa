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
import CreateTournamentModal from "../modal/create-tournament-modal";
import { toast } from "sonner";
import SearchInput from "../search-input";

export default function Tournament() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);
  const { user } = useContext(AppContext);
  const userRole = user?.role;
  const [userHasJoinedTournament, setUserHasJoinedTournament] = useState(false);

  useEffect(() => {
    const fetchUserTournamentStatus = async () => {
      const userData = await api.getCurrentUser();
      if (userData.user?.tournament_id) {
        setUserHasJoinedTournament(true);
      }
    };

    fetchUserTournamentStatus();
  }, []);

  const columns = [
    {
      accessorKey: "name",
      header: () => <div className="text-center">TOURNAMENT NAME</div>,
      cell: ({ row }: { row: { original: any } }) => (
        <div className="text-left">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "start_date",
      header: () => <div className="text-center">START DATE</div>,
      cell: ({ row }: { row: { original: any } }) => (
        <div className="text-center">{row.original.start_date}</div>
      ),
    },
    {
      accessorKey: "end_date",
      header: () => <div className="text-center">END DATE</div>,
      cell: ({ row }: { row: { original: any } }) => (
        <div className="text-center">{row.original.end_date}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">STATUS</div>,
      cell: ({ row }: { row: { original: any } }) => (
        <div className="text-center">{getStatusBadge(row.original.status)}</div>
      ),
    },
    {
      accessorKey: "teams_count",
      header: () => <div className="text-center">TEAMS PARTICIPATING</div>,
      cell: ({ row }: { row: { original: any } }) => (
        <div className="text-center">{row.original.teams_count}</div>
      ),
    },
    {
      accessorKey: "join",
      header: () => <div className="text-center">JOIN</div>,
      cell: ({ row }: { row: { original: any } }) => (
        <div className="text-center">
          <Button
            variant="secondary"
            onClick={() => handleJoinTournament(row.original.id)}
            disabled={
              userRole === "university_manager" ||
              userHasJoinedTournament ||
              filteredTeams.length === 0
            }
          >
            {userRole === "university_manager"
              ? "Not Allowed"
              : userHasJoinedTournament
              ? "Already Joined"
              : "Join"}
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "details",
      header: () => <div className="text-center">Details</div>,
      cell: ({ row }: { row: { original: any } }) => (
        <div className="text-center">
          <Button
            className="border-0 hover:text-primary bg-transparent"
            variant={"outline"}
            onClick={() => handleViewTournament(row.original.id)}
          >
            <List />
            <span className="sr-only">View tournament</span>
          </Button>
        </div>
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
      teams_count: tournament.teams?.length || 0,
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
      const universityId = user?.university_id;
      if (!universityId) {
        console.error("University ID not found for user.");
        return;
      }
      const response = await api.getTournaments(universityId);
      setTournaments(formatTournaments(response.tournaments));
      setFilteredTournaments(formatTournaments(response.tournaments));
      console.log("Raw tournaments from API:", response.tournaments);
      const formattedTournaments = formatTournaments(response.tournaments);
      console.log("Formatted tournaments:", formattedTournaments);
      setTournaments(formattedTournaments);
      setFilteredTournaments(formattedTournaments);
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
        toast.error(
          "You need to be part of a team before joining a tournament."
        );
        return;
      }

      const teamId = parseInt(teamIdString, 10);

      if (isNaN(teamId)) {
        console.error("Invalid teamId stored in localStorage.");
        toast.error("Invalid team data. Please try again later.");
        return;
      }

      await api.registerTeamInTournament(tournamentId, teamId);

      setTimeout(() => {
        fetchTournaments();
      }, 1000);
    } catch (error) {
      console.error("Error joining tournament:", error);
    }
  };

  const handleViewTournament = (tournamentId: number) => {
    window.location.href = `/dashboard/tournaments/${tournamentId}`;
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
        <div className="overflow-x-auto flex-col">
          <div className="flex justify-end">
            <CreateTournamentModal />
          </div>
          <SearchInput
            handleSearch={(search: string) => {
              const searchTerm = search.toLowerCase().trim();
              const filtered = teams.filter((team) =>
                team.name.toLowerCase().includes(searchTerm)
              );
              setFilteredTeams(filtered);
            }}
            placeholder="Search teams by exact name..."
          />
          <SearchInput
            handleSearch={(search: string) => {
              const searchTerm = search.toLowerCase().trim();
              if (searchTerm === "") {
                setFilteredTournaments(tournaments);
                return;
              }

              // Only show tournaments that contain the exact search term
              const filtered = tournaments.filter((tournament) => {
                const tournamentName = tournament.name.toLowerCase();
                // Split the tournament name into words and check if any word matches exactly
                const tournamentWords = tournamentName.split(/\s+/);
                const searchWords = searchTerm.split(/\s+/);

                // Check if all search words are found in the tournament name
                return searchWords.every((searchWord: string) =>
                  tournamentWords.some((word: string) =>
                    word.includes(searchWord)
                  )
                );
              });

              setFilteredTournaments(filtered);
              setPage(0);
            }}
            placeholder="Search tournaments by name..."
          />
          <Table
            columns={columns}
            rows={filteredTournaments}
            loading={loading}
            size={size}
            page={page}
            totalRows={filteredTournaments.length}
            onPageChange={handlePageChange}
            disablePaginations={filteredTournaments.length <= 10}
          />
        </div>
      </div>
    </div>
  );
}
