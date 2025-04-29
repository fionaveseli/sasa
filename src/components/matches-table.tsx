"use client";

import { getSearchParams } from "@/utils/paginationUtils";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { List } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { getMatches } from "@/api/matchesService"; // ✅ using getMatches
import Table from "./table";
import SubmitScoreModal from "./modal/submit-score-modal";

export default function Matches() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [matches, setMatches] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

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
        <div className="flex gap-2">
          <Button
            className="border-0 hover:text-primary bg-transparent"
            variant={"outline"}
            onClick={() => handleViewMatch(row.original.id)}
          >
            <List />
            <span className="sr-only">View match</span>
          </Button>
          <Button
            className="text-xs"
            variant="outline"
            onClick={() => {
              setSelectedMatchId(row.original.id);
              setScoreModalOpen(true);
            }}
          >
            Submit Score
          </Button>
        </div>
      ),
    },
  ];

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

  const fetchMatches = async () => {
    try {
      setLoading(true);

      const tournamentIdParam = searchParams.get("tournamentId");
      if (!tournamentIdParam) {
        console.error("Tournament ID is missing from the URL.");
        return;
      }

      const tournamentId = parseInt(tournamentIdParam, 10);
      if (isNaN(tournamentId)) {
        console.error("Invalid tournament ID.");
        return;
      }

      const token = localStorage.getItem("token") || "";
      const response = await getMatches(tournamentId, token);
      setMatches(formatMatches(response.data?.matches ?? []));
      const formattedMatches = formatMatches(response.data?.matches ?? []);
      setMatches(formattedMatches);
      setTotalRows(formattedMatches.length);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatch = (matchId: number) => {
    window.location.href = `/dashboard/matches/${matchId}`;
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
    fetchMatches();
  }, [searchParams]); // ✅ refetch if URL changes

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-auto">
      <div className="w-full">
        <div className="overflow-x-auto">
          <div className="flex justify-end">
            {/* Optional buttons or actions */}
          </div>
          <Table
            columns={columns}
            rows={matches}
            loading={loading}
            size={size}
            page={page}
            totalRows={totalRows}
            onPageChange={handlePageChange}
          />
        </div>
        <SubmitScoreModal
          open={scoreModalOpen}
          setOpen={setScoreModalOpen}
          matchId={selectedMatchId}
          refreshMatches={fetchMatches}
        />
      </div>
    </div>
  );
}
