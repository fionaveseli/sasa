"use client";

import { Trophy, Calendar, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { api, University, Team, Match } from "@/services/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CreateTeamModal from "@/components/modal/create-team-modal";

export default function UniversityPage() {
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("bracket");
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

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

  // Format dates for upcoming matches
  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }) +
      " " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!university) {
    return <div className="p-4">No university data available</div>;
  }

  // Render the teams tab content
  const renderTeamsTab = () => {
    return (
      <div className="mt-4">
        {teams.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <p className="text-gray-600">No teams found for this university.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {teams.map((team) => (
              <div key={team.id} className="bg-white p-3 rounded-lg shadow border">
                <div className="flex items-center gap-2 mb-2">
                  <img src="/logo.svg" alt="Team Logo" className="h-6" />
                  <h4 className="text-base font-medium">{team.name}</h4>
                </div>
                
                <div className="mb-2">
                  <h5 className="text-xs font-medium text-gray-500 mb-1">Team Members</h5>
                  <p className="text-xs text-gray-700">
                    {team.players.map(player => player.fullName).join(", ")}
                  </p>
                </div>
                
                <div className="mb-2">
                  <h5 className="text-xs font-medium text-gray-500 mb-1">Team Bio</h5>
                  <p className="text-xs text-gray-700">
                    {team.bio || `Team ${team.name} from ${university.name}`}
                  </p>
                </div>
                
                <div className="flex items-center gap-1">
                  <Trophy className="text-yellow-500 h-3 w-3" />
                  <span className="text-xs">{team.wins || 0} Wins</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render the bracket tab content
  const renderBracketTab = () => {
    return (
      <div className="mt-4 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Tournament Bracket</h3>
        <p className="text-gray-600">Tournament bracket will be displayed here.</p>
      </div>
    );
  };

  // Render the support tab content
  const renderSupportTab = () => {
    return (
      <div className="mt-4 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Support</h3>
        <p className="text-gray-600">Support information will be displayed here.</p>
      </div>
    );
  };

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

      {/* Stats Section */}
      <div className="flex items-center gap-4 mt-4">
        {/* Winner Count */}
        <div className="bg-white shadow-sm rounded-xl px-5 py-3 flex items-center gap-3">
          <Trophy className="text-yellow-400 w-5 h-5" />
          <span className="text-[15px]">3 Times Winner</span>
        </div>

        {/* Next Matches */}
        <div className="bg-white shadow-sm rounded-xl px-5 py-3 flex items-center gap-3">
          <Calendar className="text-gray-400 w-5 h-5" />
          <div>
            <div className="text-[15px]">30 Sep</div>
            <div className="text-xs text-gray-500">Next Match</div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl px-5 py-3 flex items-center gap-3">
          <Calendar className="text-gray-400 w-5 h-5" />
          <div>
            <div className="text-[15px]">1 Nov</div>
            <div className="text-xs text-gray-500">Next Match</div>
          </div>
        </div>

        {/* Teams Signed */}
        <div className="ml-auto bg-white shadow-sm rounded-xl px-5 py-3 flex items-center gap-3">
          <div className="text-[15px]">Teams Signed</div>
          <div className="text-xl font-medium">{teams.length}</div>
        </div>
      </div>

      <div className="flex gap-8 mt-6">
        {/* Left side - University Bio */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold uppercase">UNIVERSITY BIO</h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            {university.bio}
          </p>
        </div>

        {/* Right side - Teams Panel */}
        <div className="w-[360px] bg-white rounded-lg shadow-sm">
          <div className="flex border-b">
            <button 
              className={`px-3 py-2 text-sm ${activeTab === "bracket" ? "text-gray-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("bracket")}
            >
              Bracket
            </button>
            <button 
              className={`px-3 py-2 text-sm ${activeTab === "teams" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("teams")}
            >
              Teams
            </button>
            <button 
              className={`px-3 py-2 text-sm ${activeTab === "support" ? "text-gray-600" : "text-gray-600"}`}
              onClick={() => setActiveTab("support")}
            >
              Support
            </button>
          </div>

          <div className="p-3">
            {activeTab === "teams" && (
              <div className="h-[280px] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-3">
                  {teams.map((team) => (
                    <div key={team.id} className="bg-white rounded-lg shadow p-3">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center">
                          <img 
                            src="/logo.svg" 
                            alt="Team Logo" 
                            className="w-4 h-4"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-0.5">{team.name}</h4>
                          <p className="text-xs text-gray-600">
                            Members: {team.players.slice(0, 2).map(player => player.fullName).join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "bracket" && renderBracketTab()}
            {activeTab === "support" && renderSupportTab()}
          </div>
        </div>
      </div>

      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
      />
    </div>
  );
}
