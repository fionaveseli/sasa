"use client";

import CreateTeamModal from "@/components/modal/create-team-modal";
import LeaveTeamModal from "@/components/modal/leave-team-modal";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, Team, Match } from "@/services/api";

export default function TeamPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUniversityManager, setIsUniversityManager] = useState(false);
  const router = useRouter();

  const handleTeamLeave = () => {
    // Redirect to teams page after leaving
    setTeam(null);
    router.push("/dashboard/teams");
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTeamData = async () => {
      try {
        // First check if user is a university manager
        const userData = await api.getCurrentUser();
        const userRole = userData.user?.role;

        if (userRole === "university_manager") {
          setIsUniversityManager(true);
          setLoading(false);
          return; // Don't try to fetch team data for university managers
        }

        // Get the team data
        const teamData = await api.getCurrentTeam();
        setTeam(teamData);

        // Get upcoming matches for the team
        const tournamentData = await api.getCurrentTournament();
        if (tournamentData) {
          const matches = await api.getTournamentMatches(tournamentData.id);
          // Filter matches related to this team and scheduled in the future
          const teamMatches = matches.filter(
            (match) =>
              (match.team1_id === teamData.id ||
                match.team2_id === teamData.id) &&
              new Date(match.scheduled_time) > new Date() &&
              match.status === "scheduled"
          );
          // Sort by date (closest first)
          teamMatches.sort(
            (a, b) =>
              new Date(a.scheduled_time).getTime() -
              new Date(b.scheduled_time).getTime()
          );
          setUpcomingMatches(teamMatches);
        }
      } catch (error: any) {
        console.error("Error fetching team data:", error);

        // If we get a 401 error, the token is invalid
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        // Don't set error for users not in a team - we'll handle this in the UI
        if (error.message === "User is not a member of any team") {
          // Just set team to null without showing an error
          setTeam(null);
          setLoading(false);
          return;
        }

        setError("Failed to load team data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading team data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isUniversityManager) {
    return (
      <div className="flex flex-col items-center -mt-[10vh] justify-center min-h-screen gap-4">
        <p className="text-lg">
          As a University Manager, you cannot join or create teams.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/teams")}
          >
            Manage Teams
          </Button>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center -mt-[10vh] justify-center min-h-screen gap-4">
        <p className="text-lg">You are not part of any team yet!</p>
        <div className="flex gap-3">
          <Button onClick={() => setIsModalOpen(true)}>Create Team</Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/teams")}
          >
            Browse Teams
          </Button>
        </div>
        <CreateTeamModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    );
  }

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

  // Count wins for this team
  const getWins = () => {
    // Either use the wins property if available, or default to 0
    return team?.wins || 0;
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b rounded-md">
        <div className="flex items-center gap-3 p-4 rounded-md">
          <img src="/logo.svg" alt="Team Logo" className="h-10" />
          <h1 className="text-2xl">{team.name}</h1>
        </div>
      </div>

      <div className="flex items-start mt-4 gap-2">
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
          <Trophy className="text-yellow-500" />
          <span>{getWins()} Times Winner</span>
        </div>
        {upcomingMatches.length > 0 && (
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
            <Calendar className="text-blue-500" />
            <span>{formatMatchDate(upcomingMatches[0].scheduled_time)}</span>
          </div>
        )}
        {upcomingMatches.length > 1 && (
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
            <Calendar className="text-blue-500" />
            <span>{formatMatchDate(upcomingMatches[1].scheduled_time)}</span>
          </div>
        )}
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">TEAM MEMBERS</h2>
        <p className="text-gray-600 mt-2">
          {team.players.map((player) => player.fullName).join(", ")}
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">TEAM BIO</h2>
        <p className="text-gray-600 mt-2">
          {/* If your API doesn't provide a bio, show a default message */}
          {team.bio ||
            `Team ${team.name} from university ID ${team.university_id}`}
        </p>
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
        teamName={team.name}
        teamId={team.id}
        onSuccess={handleTeamLeave}
      />
    </div>
  );
}
