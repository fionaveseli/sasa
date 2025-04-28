"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { submitScore } from "@/api/matchesService";

interface SubmitScoreModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  matchId: number | null;
  refreshMatches: () => void;
}

export default function SubmitScoreModal({
  open,
  setOpen,
  matchId,
  refreshMatches,
}: SubmitScoreModalProps) {
  const [scoreInput, setScoreInput] = useState<number | "">("");
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitScore = async () => {
    if (!matchId || scoreInput === "") return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      await submitScore(matchId, Number(scoreInput), proofImage, token);

      alert("Score submitted successfully!");
      setOpen(false);
      setScoreInput("");
      setProofImage(null);

      await refreshMatches();
    } catch (error) {
      console.error("Error submitting score:", error);
      alert("Failed to submit score.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Submit Score</DialogTitle>
        <div className="flex flex-col gap-4">
          <Input
            type="number"
            placeholder="Enter your score"
            value={scoreInput}
            onChange={(e) => setScoreInput(Number(e.target.value))}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setProofImage(e.target.files?.[0] || null)}
          />
          <Button onClick={handleSubmitScore} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
