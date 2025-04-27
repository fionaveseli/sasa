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
      // Use the api.joinTeam function which has toast notifications
      await api.joinTeam(teamId);

      // Add a delay to allow the toast to be visible
      setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 1000); // 1 second delay
    } catch (err: any) {
      console.error("Error joining team:", err);
      setError(
        err.response?.data?.message || "Failed to join team. Please try again."
      );
      setLoading(false);
    }
    // Don't set loading to false if we're going to close the modal
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
