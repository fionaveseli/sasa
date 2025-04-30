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
  const [loading, setLoading] = useState(false);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setProofImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (scoreValue: number) => {
    if (!matchId || !proofImage) {
      setError("Please upload proof image.");
      toast.error("Proof image is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", proofImage);

      const imgbbApiKey = "1e100bc14599aee8536fc2510b09f5dc";

      const uploadRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.data?.url;

      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      const token = localStorage.getItem("token") || "";
      await submitScore(matchId, scoreValue, imageUrl, token);

      toast.success("Score submitted successfully!");
      setOpen(false);
      setProofImage(null);
      await refreshMatches();
    } catch (err) {
      console.error("Error submitting score:", err);
      toast.error("Failed to submit score.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md px-6 py-5 rounded-2xl shadow-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-medium text-gray-900">
            Submit Match Result
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Proof Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition"
              onClick={() => handleSubmit(1)}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Declare Win"}
            </Button>

            <Button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-xl transition"
              onClick={() => handleSubmit(0)}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Declare Loss"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
