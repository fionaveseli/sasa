"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTournamentModal({
  isOpen,
  onClose,
}: CreateTournamentModalProps) {
  const [tournamentName, setTournamentName] = useState("");
  const [date, setDate] = useState("");
  const [notifyAll, setNotifyAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!tournamentName.trim() || !date.trim()) {
      setError("Tournament name and date are required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = await userRes.json();
      const university_id = userData.user.university_id;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tournaments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tournamentName,
          type: "international",
          registration_deadline: new Date(date).toISOString(),
          start_date: new Date(date).toISOString(),
          end_date: new Date(date).toISOString(),
          university_id,
          bracket_type: "single_elimination",
          description: "International tournament",
          rules: "Standard tournament rules apply.",
          time_zone: "UTC",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create tournament");
      }

      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl px-6 py-6">
        <DialogHeader>
          <DialogTitle className="text-center font-light text-lg">
            Create International Tournament
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label className="text-gray-700 text-sm mb-1 block">
              Tournament Name
            </label>
            <Input
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm mb-1 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 mt-2">
            <Checkbox
              checked={notifyAll}
              onCheckedChange={(checked) => setNotifyAll(!!checked)}
            />
            Notify all teams
          </label>
        </div>

        <DialogFooter className="mt-4">
          <Button
            className="w-full bg-lime-400 text-black font-semibold hover:bg-lime-500 rounded-full"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create International Tournament"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
