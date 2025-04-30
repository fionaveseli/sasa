"use client";

import { use, useContext, useEffect, useState } from "react";
import { getMatches, updateMatchStatus } from "@/api/matchesService";
import { AppContext } from "@/context/app-context";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import TabsModel from "@/components/tabs-model";
import SubmitScoreModal from "@/components/modal/submit-score-modal";
import ScoreDisputeModal from "@/components/modal/score-dispute-modal";
import type { TabsType } from "@/types/dto/TabsType";
import { Bracket, IRoundProps } from "@sportsgram/brackets";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";

interface TournamentPageProps {
  params: Promise<{ id: string }>;
}

export default function TournamentDetails({ params }: TournamentPageProps) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const { user } = useContext(AppContext);
  const userTeamId = Number(localStorage.getItem("teamId"));

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeMatch, setDisputeMatch] = useState<any | null>(null);

  const openSubmitScoreModal = (matchId: number) => {
    setSelectedMatchId(matchId);
    setSubmitModalOpen(true);
  };

  const startMatch = async (matchId: number) => {
    try {
      const token = localStorage.getItem("token") || "";
      await updateMatchStatus(matchId, "in_progress", token);
      toast.success("Match started successfully!");
      await fetchMatches();
    } catch (err) {
      console.error("Error starting match:", err);
      toast.error("Could not start the match.");
    }
  };

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      const response = await getMatches(Number(id), token);
      setMatches(response.data?.matches ?? []);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [id]);

  const formatMatches = (data: any[]) => {
    return data.map((match, index) => ({
      id: match.id || index + 1,
      round_number: match.round_number,
      match_number: match.match_number,
      team1_id: match.team1_id,
      team2_id: match.team2_id,
      team1_name: match.team1?.name || `Team ${match.team1_id}`,
      team2_name: match.team2?.name || `Team ${match.team2_id}`,
      status: match.status,
      winner_name: match.winner?.name || "-",
      scores: match.scores || [],
    }));
  };

  const getStatusBadge = (status: string) => {
    const base = "border rounded px-2 py-1 text-xs";
    const statusStyles: Record<string, string> = {
      scheduled: "bg-yellow-100 text-yellow-800 border-yellow-200",
      in_progress: "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-orange-100 text-orange-800 border-orange-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      disputed: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <span className={`${base} ${statusStyles[status] || ""}`}>
        {status.replace("_", " ")}
      </span>
    );
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
    { accessorKey: "winner_name", header: "WINNER" },
    {
      accessorKey: "details",
      header: "ACTIONS",
      cell: ({ row }: { row: { original: any } }) => {
        const match = row.original;
        const isTeamInMatch =
          match.team1_id === userTeamId || match.team2_id === userTeamId;

        const isManager = user?.role === "university_manager";
        const isPending = match.status === "pending";
        const isInProgress = match.status === "in_progress";

        const conflicting =
          match.status === "disputed" &&
          match.scores?.length === 2 &&
          match.scores[0].score_value === match.scores[1].score_value;

        return (
          <div className="flex items-center gap-2">
            {isTeamInMatch && isInProgress && !isManager && (
              <Button
                size="sm"
                variant="default"
                onClick={() => openSubmitScoreModal(match.id)}
              >
                Submit Score
              </Button>
            )}

            {isManager && isPending && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => startMatch(match.id)}
              >
                Start Match
              </Button>
            )}

            {isManager && conflicting && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setDisputeMatch(match);
                  setDisputeModalOpen(true);
                }}
              >
                Resolve Dispute
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const groupedMatchesByRound = matches.reduce((acc: any, match: any) => {
    if (!acc[match.round_number]) {
      acc[match.round_number] = [];
    }
    acc[match.round_number].push({
      id: match.id,
      date: new Date().toISOString(),
      teams: [
        { name: match.team1?.name || `Team ${match.team1_id}` },
        { name: match.team2?.name || `Team ${match.team2_id}` },
      ],
    });
    return acc;
  }, {});

  const rounds: IRoundProps[] = Object.keys(groupedMatchesByRound)
    .sort((a, b) => Number(a) - Number(b))
    .map((roundNumber) => ({
      title: `Round ${roundNumber}`,
      seeds: groupedMatchesByRound[roundNumber],
    }));

  const tabs: TabsType[] = [
    {
      key: "Matches",
      value: "Matches",
      label: "Matches",
      component: (
        <div className="w-full">
          <Table
            columns={columns}
            rows={formatMatches(matches)}
            loading={loading}
            size={1000}
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
        <div className="w-full overflow-x-auto pt-4">
          <Bracket rounds={rounds} />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] w-full">
        <MoonLoader size={20} color="#200936" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <TabsModel
        tabs={tabs}
        defaultTab="Matches"
        viewPermissions={["Matches", "Bracket"]}
      />

      <SubmitScoreModal
        open={submitModalOpen}
        setOpen={setSubmitModalOpen}
        matchId={selectedMatchId}
        refreshMatches={fetchMatches}
      />

      {disputeModalOpen && disputeMatch && (
        <ScoreDisputeModal
          open={disputeModalOpen}
          setOpen={setDisputeModalOpen}
          matchId={disputeMatch.id}
          team1Name={disputeMatch.team1_name}
          team2Name={disputeMatch.team2_name}
          team1Id={disputeMatch.team1_id}
          team2Id={disputeMatch.team2_id}
          refreshMatches={fetchMatches}
        />
      )}
    </div>
  );
}
