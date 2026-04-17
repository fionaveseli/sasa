"use client";

import { Trophy, Calendar, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getUniversities, getUniversityTeams } from "@/api/universityService";
import type { University } from "@/api/universityService";
import type { Team } from "@/api/teamService";
import { MoonLoader } from "react-spinners";
import { useParams } from "next/navigation";

export default function UniversityDetailPage() {
  const params = useParams();
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  const universityId = parseInt(params.id as string);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        if (isNaN(universityId)) {
          setError("Invalid university ID");
          setLoading(false);
          return;
        }

        const { universities } = await getUniversities();
        const universityData = universities.find(
          (uni) => uni.id === universityId
        );

        if (!universityData) {
          setError("University not found");
          setLoading(false);
          return;
        }

        setUniversity(universityData);

        const teamsResponse = await getUniversityTeams(universityId);
        setTeams(teamsResponse);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching university data:", err);
        setError("Failed to load university data");
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [universityId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] w-full">
        <MoonLoader size={20} color="#200936" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!university) {
    return <div className="p-4">No university data available</div>;
  }

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="relative w-full h-[200px] flex items-center justify-center overflow-hidden rounded-md"
        style={{ backgroundColor: university?.banner_color || "#e37339" }}
      >
        <img
          src={university?.logo || "/default-banner.jpg"}
          alt="University Banner"
          className="absolute w-full h-full object-cover opacity-20"
        />
        <div className="relative flex flex-col items-center text-white text-center">
          <img
            src={university?.logo || "/default-university-logo.png"}
            alt="University Logo"
            className="h-16 mb-2"
          />
          <h1 className="text-3xl font-bold">{university?.name}</h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Tournament Wins */}
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <Trophy className="text-yellow-400 w-10 h-10" />
          <div className="flex flex-col justify-center">
            <p className="text-xl font-bold">0</p>
            <p className="text-gray-500 text-sm">Tournament Wins</p>
          </div>
        </div>
        {/* Next Match */}
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <Calendar className="text-gray-400 w-10 h-10" />
          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold">TBD</p>
            <p className="text-gray-500 text-sm">Next Match</p>
          </div>
        </div>

        {/* Teams Signed */}
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <Users className="text-blue-400 w-8 h-8 mb-2" />
          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold">{teams.length}</p>
            <p className="text-gray-500 text-sm">Teams Signed</p>
          </div>
        </div>
      </div>

      {/* University Bio */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold uppercase">UNIVERSITY BIO</h2>
        <p className="text-gray-600 mt-4 leading-relaxed">{university.bio}</p>
      </div>

      {/* Teams List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold uppercase mb-4">TEAMS</h2>
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold">{team.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {team.players?.length || 0} members
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            No teams registered yet
          </div>
        )}
      </div>
    </div>
  );
}
