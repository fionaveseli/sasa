"use client";

import { Trophy, Calendar, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { api, University, Team, Match } from "@/services/api";
import { useRouter } from "next/navigation";

export default function UniversityPage() {
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        // Get current user to get their university_id and role
        const userResponse = await api.getCurrentUser();
        const universityId = userResponse.user?.university_id;
        const role = userResponse.user?.role;
        
        setUserRole(role);

        if (!universityId) {
          setError("You are not associated with any university");
          setLoading(false);
          return;
        }

        // Fetch university details from the universities list
        const universitiesResponse = await api.getUniversities();
        const universityData = universitiesResponse.find(uni => uni.id === universityId);
        
        if (!universityData) {
          setError("University not found");
          setLoading(false);
          return;
        }
        
        setUniversity(universityData);

        // Fetch university teams
        const teamsResponse = await api.getUniversityTeams(universityId);
        setTeams(teamsResponse);

        // Fetch upcoming matches
        const tournament = await api.getCurrentTournament();
        if (tournament) {
          const matches = await api.getTournamentMatches(tournament.id);
          // Filter matches for this university's teams
          const universityTeamIds = teamsResponse.map(team => team.id);
          const universityMatches = matches.filter(match => 
            universityTeamIds.includes(match.team1_id) || 
            universityTeamIds.includes(match.team2_id)
          );
          setUpcomingMatches(universityMatches.filter(match => match.status === "scheduled"));
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching university data:", err);
        setError("Failed to load university data");
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!university) {
    return <div className="p-4">No university data available</div>;
  }

  return (
    <div>
      <div
        className="flex items-center justify-between border-b rounded-md"
        style={{ backgroundColor: university.banner_color || "#e37339" }}
      >
        <div className="flex items-center gap-3 p-4 rounded-md">
          <img
            src={university.logo || "/default-university-logo.png"}
            alt="University Logo"
            className="h-10"
          />
          <h1 className="text-2xl">{university.name}</h1>
        </div>
        {userRole === "university_manager" && (
          <div className="p-4">
            <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm">
              University Manager
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <div className="flex justify-between items-center mt-4 gap-2">
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
            <Trophy className="text-yellow-500" />
            <span>{teams.length} Teams</span>
          </div>
          {upcomingMatches.slice(0, 2).map((match, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
              <Calendar className="text-blue-500" />
              <span>{new Date(match.scheduled_time).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
            <Users className="text-gray-500" />
            <span>{teams.length} Teams Signed</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">UNIVERSITY BIO</h2>
        <p className="text-gray-600 mt-2">{university.bio}</p>
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
          <h3 className="text-lg font-semibold mb-2">Current Teams</h3>
          <div className="grid grid-cols-3 gap-2">
            {teams.map((team) => (
              <div key={team.id} className="bg-white p-2 rounded-md shadow">
                {team.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
