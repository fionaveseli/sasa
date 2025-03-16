"use client";

import { Trophy, Calendar, Users } from "lucide-react";

export default function UniversityPage() {
  const universityData = {
    name: "RIT Kosovo",
    logo: "/ritlogo.png",
    wins: 3,
    nextMatch1: "30 Sep 11:00",
    nextMatch2: "1 Nov 12:00",
    signedTeams: 24,
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit.",
    teams: ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6"],
    background: "#e37339",
  };

  return (
    <div>
      <div
        className="flex items-center justify-between border-b rounded-md"
        style={{ backgroundColor: universityData.background }}
      >
        <div className="flex items-center gap-3 p-4 rounded-md">
          <img
            src={universityData.logo}
            alt="University Logo"
            className="h-10"
          />
          <h1 className="text-2xl">{universityData.name}</h1>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex justify-between items-center mt-4 gap-2">
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
            <Trophy className="text-yellow-500" />
            <span>{universityData.wins} Times Winner</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
            <Calendar className="text-blue-500" />
            <span>{universityData.nextMatch1}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
            <Calendar className="text-blue-500" />
            <span>{universityData.nextMatch2}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
            <Users className="text-gray-500" />
            <span>{universityData.signedTeams} Teams Signed</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">UNIVERSITY BIO</h2>
        <p className="text-gray-600 mt-2">{universityData.bio}</p>
      </div>

      <div className="mt-6">
        <div className="flex border-b pb-2 space-x-4">
          <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600">
            Bracket
          </button>
          <button className="px-4 py-2 text-gray-500">Teams</button>
          <button className="px-4 py-2 text-gray-500">Support</button>
        </div>

        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Current Tournament</h3>
          <div className="grid grid-cols-3 gap-2">
            {universityData.teams.map((team, index) => (
              <div key={index} className="bg-white p-2 rounded-md shadow">
                {team}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
