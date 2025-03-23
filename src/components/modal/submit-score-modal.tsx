import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SubmitScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: { teamA: string; teamB: string } | null;
}

export default function SubmitScoreModal({
  isOpen,
  onClose,
  match,
}: SubmitScoreModalProps) {
  const [selectedResult, setSelectedResult] = useState<"WON" | "LOST" | null>(
    null
  );
  const [imageProof, setImageProof] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImageProof(event.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex justify-between">
          <DialogTitle className="text-lg font-semibold">
            Submit Score for {match?.teamA} vs {match?.teamB}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <p className="text-gray-700 text-sm">
            Select the outcome for your team:
          </p>
          <div className="flex gap-4">
            <Button
              variant={selectedResult === "WON" ? "default" : "outline"}
              onClick={() => setSelectedResult("WON")}
            >
              WON 🏆
            </Button>
            <Button
              variant={selectedResult === "LOST" ? "default" : "outline"}
              onClick={() => setSelectedResult("LOST")}
            >
              LOST ❌
            </Button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700 ">
              Upload image proof <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer">
              <input
                type="file"
                className="hidden"
                id="fileUpload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer text-gray-500"
              >
                {imageProof ? imageProof.name : "Drag & drop files or Browse"}
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            className="w-full bg-lime-400 text-black font-semibold hover:bg-lime-500"
            disabled={!selectedResult || !imageProof}
            onClick={() => {
              alert("Score Submitted!");
              onClose();
            }}
          >
            Submit Score
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
