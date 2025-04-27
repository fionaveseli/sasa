"use client";

import { Trophy, Calendar, Users, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { api, University, Team, Match } from "@/services/api";
import { useRouter } from "next/navigation";
import CreateTeamModal from "@/components/modal/create-team-modal";
import { MoonLoader } from "react-spinners";
import TabContentTransition from "@/components/university/university-animation";
import PathDrawing from "@/components/university/path-drawing";

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
  const [tournamentWins, setTournamentWins] = useState(0);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const userResponse = await api.getCurrentUser();
        const universityId = userResponse.user?.university_id;
        const role = userResponse.user?.role;
        setUserRole(role);

        if (!universityId) {
          setError("You are not associated with any university");
          setLoading(false);
          return;
        }

        const universitiesResponse = await api.getUniversities();
        const universityData = universitiesResponse.find(
          (uni) => uni.id === universityId
        );
        if (!universityData) {
          setError("University not found");
          setLoading(false);
          return;
        }

        setUniversity(universityData);

        const teamsResponse = await api.getUniversityTeams(universityId);
        setTeams(teamsResponse);

        const tournament = await api.getCurrentTournament();
        if (tournament) {
          const matches = await api.getTournamentMatches(tournament.id);
          const universityTeamIds = teamsResponse.map((team) => team.id);
          const universityMatches = matches.filter(
            (match) =>
              universityTeamIds.includes(match.team1_id) ||
              universityTeamIds.includes(match.team2_id)
          );
          setUpcomingMatches(
            universityMatches.filter((match) => match.status === "scheduled")
          );

          const completedMatches = matches.filter(
            (match) => match.status === "completed"
          );
          const wins = completedMatches.filter((match) => {
            const winningTeamId = match.winner_id;
            return (
              winningTeamId !== null &&
              universityTeamIds.includes(winningTeamId)
            );
          }).length;
          setTournamentWins(wins);
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

  const renderTeamsTab = () => (
    <TabContentTransition>
      {teams.length === 0 ? (
        <div className="flex flex-col items-center p-6 rounded-lg bg-gray-100">
          <img src="/empty-teams.svg" alt="No Teams" className="w-32 mb-4" />
          <p className="text-gray-600">No teams found for this university.</p>
        </div>
      ) : (
        <>
          {/* Top Team Highlight */}
          <div className="bg-yellow-100 p-4 rounded-lg flex items-center justify-between mb-4">
            <div>
              <h4 className="text-md font-bold">Top Team</h4>
              <p className="text-sm text-gray-600">
                {teams.sort((a, b) => (b.wins || 0) - (a.wins || 0))[0]?.name}
              </p>
            </div>
            <Trophy className="text-yellow-400 w-8 h-8" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white p-3 rounded-lg shadow border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={team.logo || "/teamtigers.svg"}
                    alt="Team Logo"
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback if the team logo URL is invalid
                      e.currentTarget.src = "/teamtigers.svg";
                    }}
                  />
                  <h4 className="text-base font-medium">{team.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </TabContentTransition>
  );

  const renderBracketTab = () => (
    <TabContentTransition>
      <div className="mt-4 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Tournament Bracket</h3>
        {upcomingMatches.length > 0 ? (
          <div className="space-y-4">
            {upcomingMatches.map((match) => (
              <div key={match.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{match.team1.name}</p>
                    <p className="text-sm text-gray-500">vs</p>
                    <p className="font-medium">{match.team2.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {formatMatchDate(match.scheduled_time)}
                    </p>
                    <p className="text-sm text-gray-500">{match.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center p-6 rounded-lg bg-gray-100">
            <img
              src="/empty-bracket.svg"
              alt="No Matches"
              className="w-32 mb-4"
            />
            <p className="text-gray-600">No upcoming matches scheduled.</p>
          </div>
        )}
      </div>
    </TabContentTransition>
  );

  const renderSupportTab = () => (
    <TabContentTransition>
      {teams.length === 0 ? (
        <div className="flex flex-col items-center p-6 rounded-lg bg-gray-100">
          <img
            src="/empty-support.svg"
            alt="No Support"
            className="w-32 mb-4"
          />
          <p className="text-gray-600">No teams signed yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {teams.map((team, index) => (
            <div
              key={team.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-600">{index + 1}.</span>
                <span>{team.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="text-pink-500 h-4 w-4" />
                <span>0</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </TabContentTransition>
  );

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="relative w-full h-[200px] flex items-center justify-center overflow-hidden rounded-md"
        style={{ backgroundColor: university?.banner_color || "#e37339" }}
      >
        <div className="flex items-center justify-between bg-[your-banner-color-here] p-4 text-white">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <img
              src={university?.logo || "/default-university-logo.png"}
              alt="University Logo"
              className="h-16 w-16 object-contain"
            />
            <h1 className="text-2xl font-bold">{university?.name}</h1>
          </div>

          {/* Right: Role badge */}
          {userRole === "university_manager" && (
            <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm">
              University Manager
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Tournament Wins */}
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <Trophy className="text-yellow-400 w-10 h-10" />
          <div className="flex flex-col justify-center">
            <p className="text-xl font-bold">{tournamentWins}</p>
            <p className="text-gray-500 text-sm">Tournament Wins</p>
          </div>
        </div>
        {/* Next Match */}
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <Calendar className="text-gray-400 w-10 h-10" />
          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold">
              {upcomingMatches.length > 0
                ? formatMatchDate(upcomingMatches[0].scheduled_time)
                : "TBD"}
            </p>
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

      {/* University Bio + Teams Panel */}
      <div className="flex gap-8 mt-6">
        {/* Left side - Bio + Tabs (vertical) */}
        <div className="flex-1 flex flex-col gap-8">
          {/* University Bio */}
          <div>
            <h2 className="text-lg font-semibold uppercase">UNIVERSITY BIO</h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              {university.bio}
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex border-b">
              {["bracket", "teams", "support"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-2 text-sm transition-all duration-300 ${
                    activeTab === tab
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-3">
              {activeTab === "teams" && renderTeamsTab()}
              {activeTab === "bracket" && renderBracketTab()}
              {activeTab === "support" && renderSupportTab()}
            </div>
          </div>
        </div>

        {/* Right side - FIXED HEIGHT content */}
        <div className="w-[360px] top-0">
          <div className="bg-white p-6 flex items-center justify-center text-gray-400">
            <PathDrawing dynamicColor={university?.banner_color || "#00CFFF"} />
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
