"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
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
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setProofImage(event.target.files[0]);
    }
  };

  const handleSubmitScore = async () => {
    if (!matchId || scoreInput === "") {
      setError("Score is required.");
      toast.error("Score is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token") || "";

      await submitScore(matchId, Number(scoreInput), proofImage, token);

      toast.success("Score submitted successfully!");
      setOpen(false);
      setScoreInput("");
      setProofImage(null);

      await refreshMatches();
    } catch (err: any) {
      console.error("Error submitting score:", err);
      setError("Failed to submit score.");
      toast.error("Failed to submit score.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-extralight">
            Submit Your Score
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="flex flex-col gap-4 mt-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label className="block text-gray-700 mb-1">
              Your Team’s Score <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder="Enter score"
              value={scoreInput}
              onChange={(e) => setScoreInput(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Proof Image <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer">
              <input
                type="file"
                className="hidden"
                id="fileUpload"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer text-gray-500"
              >
                {proofImage ? proofImage.name : "Drag & drop files or Browse"}
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            className="w-full bg-lime-400 text-black font-semibold hover:bg-lime-500"
            onClick={handleSubmitScore}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Score"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
