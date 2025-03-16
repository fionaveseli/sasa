"use client";

import CreateTeamModal from "@/components/modal/create-team-modal";
import LeaveTeamModal from "@/components/modal/leave-team-modal";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users } from "lucide-react";
import { useState } from "react";

export default function TeamPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const teamData = {
    name: "Team A",
    logo: "/ritlogo.png",
    wins: 3,
    nextMatch1: "30 Sep 11:00",
    nextMatch2: "1 Nov 12:00",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit.",
    members: "John Doe, Jane Doe, Alice Doe, Bob Doe",
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b rounded-md">
        <div className="flex items-center gap-3 p-4 rounded-md">
          <img src={teamData.logo} alt="University Logo" className="h-10" />
          <h1 className="text-2xl">{teamData.name}</h1>
        </div>
      </div>

      <div className="flex items-start mt-4 gap-2">
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
          <Trophy className="text-yellow-500" />
          <span>{teamData.wins} Times Winner</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
          <Calendar className="text-blue-500" />
          <span>{teamData.nextMatch1}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
          <Calendar className="text-blue-500" />
          <span>{teamData.nextMatch2}</span>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">TEAM MEMBERS</h2>
        <p className="text-gray-600 mt-2">{teamData.members}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">TEAM BIO</h2>
        <p className="text-gray-600 mt-2">{teamData.bio}</p>
      </div>
      <Button
        className="mt-6"
        variant={"secondary"}
        onClick={() => setIsModalOpen(true)}
      >
        Leave Team
      </Button>
      <LeaveTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teamName={teamData.name}
      />
    </div>
  );
}
