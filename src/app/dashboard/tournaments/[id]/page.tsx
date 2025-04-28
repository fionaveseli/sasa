"use client";

import { use, useContext, useEffect, useState } from "react";
import { getMatches } from "@/api/matchesService";
import { AppContext } from "@/context/app-context";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import TabsModel from "@/components/tabs-model";
import SubmitScoreModal from "@/components/modal/submit-score-modal";
import type { TabsType } from "@/types/dto/TabsType";
import { List } from "lucide-react";

interface TournamentPageProps {
  params: Promise<{ id: string }>;
}

export default function TournamentDetails({ params }: TournamentPageProps) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const { user } = useContext(AppContext);
  const userRole = user?.role || "";

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  const openSubmitScoreModal = (matchId: number) => {
    setSelectedMatchId(matchId);
    setSubmitModalOpen(true);
  };

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const matchesResponse = await getMatches(Number(id), token);
      setMatches(formatMatches(matchesResponse.data?.matches ?? []));
    } catch (error) {
      console.error("Error fetching matches", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
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
          <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 rounded px-2 py-1 text-xs">
            Scheduled
          </span>
        );
      case "in_progress":
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 rounded px-2 py-1 text-xs">
            In Progress
          </span>
        );
      case "pending":
        return (
          <span className="bg-orange-100 text-orange-800 border border-orange-200 rounded px-2 py-1 text-xs">
            Pending
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-100 text-green-800 border border-green-200 rounded px-2 py-1 text-xs">
            Completed
          </span>
        );
      case "disputed":
        return (
          <span className="bg-red-100 text-red-800 border border-red-200 rounded px-2 py-1 text-xs">
            Disputed
          </span>
        );
      default:
        return (
          <span className="border rounded px-2 py-1 text-xs">{status}</span>
        );
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
        <div className="flex items-center gap-2">
          {row.original.status === "in_progress" &&
            userRole !== "university_manager" && (
              <Button
                size="sm"
                onClick={() => openSubmitScoreModal(row.original.id)}
              >
                Submit Score
              </Button>
            )}
        </div>
      ),
    },
  ];

  const tabs: TabsType[] = [
    {
      key: "Matches",
      value: "Matches",
      label: "Matches",
      component: (
        <div className="w-full">
          <Table
            columns={columns}
            rows={matches}
            loading={loading}
            size={10}
            page={0}
            totalRows={matches.length}
          />
        </div>
      ),
    },
    {
      key: "Bracket",
      value: "Bracket",
      label: "Bracket",
      component: (
        <div className="w-full flex items-center justify-center p-10">
          Bracket view coming soon...
        </div>
      ),
    },
  ];

  const allowedViews = ["Matches", "Bracket"];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full flex flex-col gap-6 p-4">
      <TabsModel
        tabs={tabs}
        defaultTab={"Matches"}
        viewPermissions={allowedViews}
      />

      {userRole !== "university_manager" && (
        <SubmitScoreModal
          open={submitModalOpen}
          setOpen={setSubmitModalOpen}
          matchId={selectedMatchId}
          refreshMatches={fetchMatches}
        />
      )}
    </div>
  );
}
