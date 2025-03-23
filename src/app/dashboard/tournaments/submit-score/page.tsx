"use client";

import { useState } from "react";
import SubmitScoreModal from "@/components/modal/submit-score-modal";
import { Button } from "@/components/ui/button";

const matches = [
  {
    teamA: "Team A",
    teamB: "Team B",
    status: "Active",
  },
  {
    teamA: "Team C",
    teamB: "Team D",
    status: "Finished",
  },
  {
    teamA: "Team E",
    teamB: "Team F",
    status: "Finished",
  },
];

export default function SubmitScorePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const openModal = (match: any) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-normal">Submit Scores</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {matches.map((match, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-md bg-white">
            <p className="text-lg font-semibold">
              {match.teamA} vs {match.teamB}
            </p>
            <p className="text-sm text-gray-500">{match.status}</p>
            {match.status === "Active" && (
              <Button
                className="mt-2 bg-lime-400 text-black"
                onClick={() => openModal(match)}
              >
                Submit Score
              </Button>
            )}
          </div>
        ))}
      </div>

      <SubmitScoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        match={selectedMatch}
      />
    </div>
  );
}
