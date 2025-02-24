"use client";

import JoinTeam from "@/components/dashboard/join-team";
import CreateTeamModal from "@/components/modal/create-team";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const teams = [
  {
    image: "/logo1.svg",
    teamName: "RIT Tigers",
    university: "RIT Kosovo",
    members: ["John Smith", "Jane Smith"],
    places: 1,
  },
  {
    image: "/logo1.svg",
    teamName: "Cyber Hawks",
    university: "MIT",
    members: ["Alice Johnson", "Bob Brown"],
    places: 2,
  },
  {
    image: "/logo1.svg",
    teamName: "Quantum Warriors",
    university: "Stanford University",
    members: ["Michael Davis", "Emma Wilson"],
    places: 0,
  },
  {
    image: "/logo1.svg",
    teamName: "AI Legends",
    university: "Harvard University",
    members: ["Olivia Martinez", "Daniel Lee"],
    places: 3,
  },
  {
    image: "/logo1.svg",
    teamName: "Data Knights",
    university: "UC Berkeley",
    members: ["Sophia Anderson", "William Thompson"],
    places: 1,
  },
];

export default function TeamsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-normal">Teams</h1>
      <div className="flex justify-between">
        <SearchInput
          handleSearch={(search) => console.log(search)}
          placeholder="Search..."
        />
        <Button variant={"secondary"} onClick={() => setIsModalOpen(true)}>
          Create Team
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {teams.map((team, index) => (
          <JoinTeam
            key={index}
            image={team.image}
            teamName={team.teamName}
            university={team.university}
            members={team.members}
            places={team.places}
          />
        ))}
      </div>
      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
