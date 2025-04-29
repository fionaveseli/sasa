"use client";

import { use, useContext, useEffect, useState } from "react";
import { getMatches } from "@/api/matchesService";
import { AppContext } from "@/context/app-context";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import TabsModel from "@/components/tabs-model";
import SubmitScoreModal from "@/components/modal/submit-score-modal";
import type { TabsType } from "@/types/dto/TabsType";
// import { Bracket, IRoundProps } from "react-brackets";
import { MoonLoader } from "react-spinners";

interface TournamentPageProps {
  params: Promise<{ id: string }>;
}

export default function TournamentDetails({ params }: TournamentPageProps) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const { user } = useContext(AppContext);
  const userRole = user?.role || "";
  const userTeamId = user?.id;

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  const openSubmitScoreModal = (matchId: number) => {
    setSelectedMatchId(matchId);
    setSubmitModalOpen(true);
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

        return (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => openSubmitScoreModal(match.id)}>
              Submit Score
            </Button>
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

  // const rounds: IRoundProps[] = Object.keys(groupedMatchesByRound)
  //   .sort((a, b) => Number(a) - Number(b))
  //   .map((roundNumber) => ({
  //     title: `Round ${roundNumber}`,
  //     seeds: groupedMatchesByRound[roundNumber],
  //   }));

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
          {/* <Bracket rounds={rounds} /> */}
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
    </div>
  );
}
