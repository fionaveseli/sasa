import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface LeaveTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
}

export default function LeaveTeamModal({
  isOpen,
  onClose,
  teamName,
}: LeaveTeamModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="sm:text-center">
          <DialogTitle>Leave {teamName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave this team?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-center gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => alert("You have left the team!")}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
