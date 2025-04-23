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
import { useState } from "react";

interface DeleteTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamId: number;
  onSuccess?: () => void;
}

export default function DeleteTeamModal({
  isOpen,
  onClose,
  teamName,
  teamId,
  onSuccess,
}: DeleteTeamModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteTeam = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.deleteTeam(teamId);
      onClose();
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Force reload the page to update the UI
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Error deleting team:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete team. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="sm:text-center">
          <DialogTitle>Delete {teamName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this team? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 p-3 text-red-600 text-sm rounded">
            {error}
          </div>
        )}

        <DialogFooter className="flex sm:justify-center gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteTeam}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
