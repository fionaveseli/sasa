"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SmileIcon, FrownIcon } from "lucide-react";
import axios from "axios";

// Define the API base URL - this should match your backend URL
const API_BASE_URL = "https://web-production-3dd4c.up.railway.app/api";

interface SubmitScoreModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  matchId: number | null;
  refreshMatches: () => void;
  teamName?: string;
  tournamentName?: string;
}

export default function SubmitScoreModal({
  open,
  setOpen,
  matchId,
  refreshMatches,
  teamName = "Team A",
  tournamentName = "Tournament",
}: SubmitScoreModalProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<"won" | "lost" | null>(
    null
  );
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset state when modal opens and check submission status
  useEffect(() => {
    if (open && matchId) {
      setSelectedOutcome(null);
      setProofImage(null);
      setImagePreview(null);
      setError(null);

      // Check if this match already has a score submitted by this team
      const checkSubmissionStatus = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token") || "";

          // Use the full API URL
          const response = await axios.get(
            `${API_BASE_URL}/matches/${matchId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status !== 200) {
            throw new Error("Failed to fetch match details");
          }

          const data = response.data;
          const userTeamId = parseInt(
            localStorage.getItem("teamId") || "0",
            10
          );

          // Check if user's team has already submitted a score
          const teamHasSubmitted = data.match.scores?.some(
            (score: any) => score.team_id === userTeamId
          );

          setHasSubmitted(!!teamHasSubmitted);

          if (teamHasSubmitted) {
            toast.info(
              "Your team has already submitted a score for this match."
            );
          }
        } catch (err) {
          console.error("Error checking submission status:", err);
        } finally {
          setLoading(false);
        }
      };

      checkSubmissionStatus();
    }
  }, [open, matchId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setProofImage(file);

      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmitScore = async () => {
    if (!matchId || selectedOutcome === null) {
      setError("Please select an outcome (won or lost).");
      toast.error("Please select an outcome (won or lost).");
      return;
    }

    if (!proofImage) {
      setError("Proof image is required.");
      toast.error("Proof image is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token") || "";
      // Convert outcome to numerical score: won = 1, lost = 0
      const scoreValue = selectedOutcome === "won" ? 1 : 0;

      // The API expects a URL string, not a file upload
      // For demonstration purposes, use a placeholder image URL
      const placeholderImageUrl = "https://via.placeholder.com/300/200";

      // Send the JSON data with score_value and proof_image_url as a string
      const response = await axios.post(
        `${API_BASE_URL}/matches/${matchId}/scores`,
        {
          score_value: scoreValue,
          proof_image_url: placeholderImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(response.data?.message || "Failed to submit score");
      }

      toast.success("Score submitted successfully!");
      setHasSubmitted(true);
      setOpen(false);
      setSelectedOutcome(null);
      setProofImage(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }

      // Refresh matches to show updated status
      await refreshMatches();
    } catch (err: any) {
      console.error("Error submitting score:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to submit score.";
      setError(errorMessage);
      toast.error(errorMessage);

      // Log more detailed error information
      if (err.response?.data) {
        console.error("Error response data:", err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen && imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        setOpen(newOpen);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogClose className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          ✕
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium">
            Submit Score for {tournamentName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 py-4">
          <p className="text-lg">You are {teamName}</p>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {hasSubmitted && (
            <p className="text-orange-500 text-sm text-center">
              Your team has already submitted a score for this match.
            </p>
          )}

          <div className="flex justify-center gap-6 w-full">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setSelectedOutcome("won")}
              disabled={loading || hasSubmitted}
              className={`flex gap-2 items-center h-16 px-6 text-lg ${
                selectedOutcome === "won"
                  ? "bg-primary text-white border-primary"
                  : "border-primary text-primary hover:text-primary"
              }`}
            >
              WON <SmileIcon className="ml-1" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setSelectedOutcome("lost")}
              disabled={loading || hasSubmitted}
              className={`flex gap-2 items-center h-16 px-6 text-lg ${
                selectedOutcome === "lost"
                  ? "bg-primary text-white border-primary"
                  : "border-primary text-primary hover:text-primary"
              }`}
            >
              LOST <FrownIcon className="ml-1" />
            </Button>
          </div>

          <div className="w-full mt-2">
            <label className="block text-sm font-medium mb-2">
              Upload image proof <span className="text-red-500">*</span>
            </label>
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
              onClick={() => document.getElementById("fileUpload")?.click()}
            >
              <input
                type="file"
                className="hidden"
                id="fileUpload"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading || hasSubmitted}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                {imagePreview ? (
                  <div className="w-full">
                    <img
                      src={imagePreview}
                      alt="Proof preview"
                      className="max-h-40 mx-auto mb-2 rounded"
                    />
                    <p className="text-sm truncate">{proofImage?.name}</p>
                  </div>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="text-sm">Drag & drop files or Browse</span>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Note: For demo purposes, a placeholder image URL will be used
              instead of uploading
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full bg-lime-400 text-black font-semibold hover:bg-lime-500"
            onClick={handleSubmitScore}
            disabled={
              loading || !selectedOutcome || !proofImage || hasSubmitted
            }
          >
            {loading
              ? "Submitting..."
              : hasSubmitted
              ? "Score Submitted"
              : "Submit Score"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
