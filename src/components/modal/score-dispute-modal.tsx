"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { resolveDispute } from "@/api/matchesService"; // ← create this API method

interface DisputeScoreModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  matchId: number;
  team1Name: string;
  team2Name: string;
  team1Id: number;
  team2Id: number;
  refreshMatches: () => void;
}

export default function DisputeScoreModal({
  open,
  setOpen,
  matchId,
  team1Name,
  team2Name,
  team1Id,
  team2Id,
  refreshMatches,
}: DisputeScoreModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<number | null>(null);

  const handleResolve = async () => {
    if (!selectedWinner) {
      toast.error("Please select a winner to resolve the match.");
      return;
    }

    setLoading(true);
    try {
      await resolveDispute(matchId, selectedWinner);
      toast.success("Dispute resolved and winner selected!");
      setOpen(false);
      await refreshMatches();
    } catch (error) {
      console.error("Dispute resolution failed:", error);
      toast.error("Could not resolve the dispute. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Resolve Score Dispute</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Both teams submitted conflicting scores. Please select the winner to
            resolve this dispute.
          </p>

          <div className="space-y-2">
            {[
              { id: team1Id, name: team1Name },
              { id: team2Id, name: team2Name },
            ].map((team) => (
              <Button
                key={team.id}
                variant={selectedWinner === team.id ? "default" : "outline"}
                className="w-full"
                onClick={() => setSelectedWinner(team.id)}
              >
                {team.name}
              </Button>
            ))}
          </div>

          <Button
            onClick={handleResolve}
            disabled={loading || !selectedWinner}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Resolving..." : "Confirm Winner"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
