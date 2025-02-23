import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
}

export default function JoinTeamModal({
  isOpen,
  onClose,
  teamName,
}: JoinTeamModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="sm:text-center">
          <DialogTitle>Join {teamName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to join this team?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-center gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => alert("You have joined the team!")}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
