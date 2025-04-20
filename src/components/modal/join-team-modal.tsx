import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { api } from "@/services/api";
import axios from "axios";

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamId: number;
  onSuccess?: () => void;
}

export default function JoinTeamModal({
  isOpen,
  onClose,
  teamName,
  teamId,
  onSuccess,
}: JoinTeamModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinTeam = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the current user to know their university
      const userData = await api.getCurrentUser();

      // Use the proper endpoint format with the teamId
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://web-production-3dd4c.up.railway.app/api";

      await axios.post(
        `${API_BASE_URL}/teams/${teamId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Error joining team:", err);
      setError(
        err.response?.data?.message || "Failed to join team. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="sm:text-center">
          <DialogTitle>Join {teamName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to join this team?
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <DialogFooter className="flex sm:justify-center gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleJoinTeam}
            disabled={loading}
          >
            {loading ? "Joining..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
