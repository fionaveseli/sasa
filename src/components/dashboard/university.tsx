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
  const [userTeamId, setUserTeamId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserTeam = async () => {
      try {
        const teamData = await api.getCurrentTeam();
        if (teamData) {
          setUserTeamId(teamData.id);
        }
      } catch (error) {
        console.error("Error fetching user's team:", error);
      }
    };

    fetchUserTeam();
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
      header: () => <div className="text-center">ACTION</div>,
      cell: ({ row }: { row: { original: any } }) => {
        const tournament = row.original;
        const isTeamInTournament = tournament.teams?.some(
          (team: any) => team.id === userTeamId
        );

        return (
          <div className="text-center">
            {userRole === "university_manager" || userRole === "admin" ? (
              <Button
                variant="secondary"
                onClick={() => handleStartTournament(tournament.id)}
                disabled={tournament.status !== "registering"}
              >
                {tournament.status === "active" ? "Tournament Started" : "Start Tournament"}
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => handleJoinTournament(tournament.id)}
                disabled={
                  isTeamInTournament ||
                  filteredTeams.length === 0 ||
                  tournament.status !== "registering"
                }
              >
                {tournament.status === "active"
                  ? "Tournament Started"
                  : isTeamInTournament
                  ? "Already Joined"
                  : filteredTeams.length === 0
                  ? "No Teams Available"
                  : "Join"}
              </Button>
            )}
          </div>
        );
      },
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
      const formattedTournaments = formatTournaments(response.tournaments);
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

      // ✅ Immediately mark that user has joined a tournament
      fetchTournaments();

      toast.success("You have successfully joined the tournament!");
    } catch (error) {
      console.error("Error joining tournament:", error);
      toast.error("Failed to join the tournament.");
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

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (!user?.university_id) {
          console.error("University ID not found for user.");
          return;
        }

        const token = localStorage.getItem("token") || "";
        const teamsResponse = await api.getUniversityTeams(user.university_id);

        console.log("Fetched university teams:", teamsResponse);

        setTeams(teamsResponse || []);
        setFilteredTeams(teamsResponse || []);
      } catch (error) {
        console.error("Error fetching university teams:", error);
      }
    };

    fetchTeams();
  }, [user]);

  const handleStartTournament = async (tournamentId: number) => {
    try {
      await api.updateTournamentStatus(tournamentId, "active");
      toast.success("Tournament started successfully!");
      fetchTournaments();
    } catch (error) {
      console.error("Error starting tournament:", error);
      toast.error("Failed to start tournament. Please try again.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-auto">
      <div className="w-full">
        <div className="overflow-x-auto flex-col">
          <div className="flex justify-end">
            <CreateTournamentModal />
          </div>
          <div className="flex gap-2 pb-2">
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
          </div>

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
