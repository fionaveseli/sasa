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

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoteSubmit: () => void;
}

export default function VoteModal({
  isOpen,
  onClose,
  onVoteSubmit,
}: VoteModalProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmVote = () => {
    if (selectedTeam) {
      alert(`You voted for: ${selectedTeam}`);
      onVoteSubmit();
      setShowConfirmModal(false);
      setSelectedTeam(null);
    }
  };

  const handleGoBack = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      {/* Main Vote Selection Modal */}
      <Dialog open={isOpen && !showConfirmModal} onOpenChange={onClose}>
        <DialogContent className="flex flex-col items-center text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold w-full">
              Who do YOU think will win?
            </DialogTitle>
          </DialogHeader>

          <p className="text-center text-sm text-gray-500 mb-4 w-full">
            Select one of the teams below:
          </p>

          <div className="flex justify-center gap-6 w-full">
            <div
              onClick={() => setSelectedTeam("Tigers")}
              className={`p-2 border-2 rounded-lg cursor-pointer transition hover:border-purple-500 border-gray-300 hover:scale-105 ${selectedTeam === "Tigers" ? "border-purple-500" : ""}`}
            >
              <img src="/teamtigers.svg" alt="Team Tigers" className="w-32 h-32 object-contain" />
            </div>

            <div
              onClick={() => setSelectedTeam("Cipher")}
              className={`p-2 border-2 rounded-lg cursor-pointer transition hover:border-purple-500 border-gray-300 hover:scale-105 ${selectedTeam === "Cipher" ? "border-purple-500" : ""}`}
            >
              <img src="/teamcipher.svg" alt="Team Cipher" className="w-32 h-32 object-contain" />
            </div>
          </div>

          <DialogFooter className="w-full mt-6">
            <div className="flex justify-center w-full">
              <Button
                variant="default"
                disabled={!selectedTeam}
                onClick={() => setShowConfirmModal(true)}
              >
                Vote
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={() => setShowConfirmModal(false)}>
        <DialogContent className="flex flex-col items-center text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold w-full">
              Are you sure you want to vote <span className="font-bold">{selectedTeam}?</span>
            </DialogTitle>
          </DialogHeader>

          <DialogFooter className="w-full mt-4">
            <div className="flex justify-center gap-4 w-full">
              <Button variant="outline" onClick={handleGoBack}>
                Go Back
              </Button>
              <Button variant="default" onClick={handleConfirmVote}>
                Vote
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}