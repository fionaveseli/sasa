"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import VoteModal from "@/components/modal/votemodal";
import { TournamentVote } from "@/types/dto/votes/TournamentVotes";
import { getTournamentVotes } from "@/api/voteService";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState<TournamentVote[]>([]); 

  const handleVoteSubmit = () => {
    setHasVoted(true);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchVotes = async () => {
      const response = await getTournamentVotes(1); 
      if (response.data) {
        setVotes(response.data);
        console.log("Fetched votes:", response.data);
      } else {
        console.error("Failed to fetch votes:", response);
      }
    };

    fetchVotes();
  }, []);

  return (
    <div>
      <Header />

      <div className="bg-white px-4 py-6 flex justify-between items-center shadow-md">
        <div className="flex-1 mr-4">
          <select className="w-full p-2 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>Upcoming</option>
            <option>International</option>
          </select>
        </div>

        <div>
          <Button className="mx-2">University</Button>
          <Button className="mx-2">International</Button>
        </div>

        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 mx-2"
        />
        <input
          type="text"
          placeholder="Search by date..."
          className="p-2 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 mx-2"
        />
      </div>

      <div className="flex justify-between items-start px-6 py-10">
        <div className="w-1/2 flex flex-col items-center">
          <img
            src="/vote-bracket.svg"
            alt="Tournament Bracket"
            className="max-w-s mx-auto mb-8"
          />
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={hasVoted}
            variant="default"
          >
            {hasVoted ? "Vote Submitted" : "Vote"}
          </Button>
        </div>

        <div className="w-1/2 flex flex-col justify-start items-center p-2">
          <div className="text-center w-full">
            <p className="min-w-[40%] text-2xl">Vote for your favorite team!</p>
            <img
              src="/favorite-team.svg"
              alt="Favorite Team"
              className="max-w-xs mx-auto"
            />
          </div>
        </div>
      </div>

      <VoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVoteSubmit={handleVoteSubmit}
      />

      <Footer />
    </div>
  );
}
