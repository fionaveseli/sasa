"use client";

import LeaveTeamModal from "@/components/modal/leave-team-modal";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/api/userService";
import { getUniversities, getUniversityTeams } from "@/api/universityService";
import { getCurrentTournament, getTournamentMatches } from "@/api/tournamentService";
import type { Match } from "@/api/tournamentService";
import type { Team } from "@/api/teamService";
import { Calendar, Trophy, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { use } from "react";

interface TeamPageProps {
  params: Promise<{ id: string }>;
}

export default function TeamPage({ params }: TeamPageProps) {
  const { id } = use(params);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const router = useRouter();

  const handleTeamLeave = () => {
    setTeam(null);
    router.push("/dashboard/teams");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTeamData = async () => {
      try {
        if (!id) return;

        const userData = await getCurrentUser();
        const { universities } = await getUniversities();

        // Search all universities for the team with this id
        let foundTeam: Team | null = null;
        for (const university of universities) {
          const { teams } = await getUniversityTeams(university.id);
          const match = teams.find((t: Team) => t.id === Number(id));
          if (match) {
            foundTeam = match;
            break;
          }
        }

        if (!foundTeam) {
          throw new Error("Team not found");
        }

        setTeam(foundTeam);

        const isMember = foundTeam.players.some(
          (player) => player.email === userData.user.email,
        );
        setIsTeamMember(isMember);

        // Fetch upcoming matches for this team
        try {
          const data = await getCurrentTournament();
          const tournament = data?.tournaments?.[0] ?? null;
          if (tournament) {
            const matches = await getTournamentMatches(tournament.id);
            const teamMatches = matches.filter(
              (match) =>
                (match.team1_id === Number(id) ||
                  match.team2_id === Number(id)) &&
                new Date(match.scheduled_time) > new Date() &&
                match.status === "scheduled",
            );
            teamMatches.sort(
              (a, b) =>
                new Date(a.scheduled_time).getTime() -
                new Date(b.scheduled_time).getTime(),
            );
            setUpcomingMatches(teamMatches);
          }
        } catch {
          // no tournament, skip
        }
      } catch (error: any) {
        console.error("Error fetching team data:", error);
        setError("Failed to load team data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] w-full">
        <MoonLoader size={20} color="#200936" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg">{error || "Team not found."}</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/teams")}
        >
          Back to Teams
        </Button>
      </div>
    );
  }

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", { day: "numeric", month: "short" }) +
      " " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between rounded-full p-2">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/dashboard/teams")}
            className="mr-2"
            variant="ghost"
          >
            <ChevronLeft className="h-8 w-8 color-primary" />
          </Button>

          <img
            src={team.logo || "/teamtigers.svg"}
            alt="Team Logo"
            className="h-24 w-24 object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.src = "/teamtigers.svg";
            }}
          />
          <h1 className="text-2xl md:text-4xl">{team.name}</h1>
        </div>
      </div>

      <div className="flex items-start mt-4 gap-2">
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
          <Trophy className="text-yellow-500" />
          <span>{team.wins || 0} Times Winner</span>
        </div>
        {upcomingMatches.length > 0 && (
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
            <Calendar className="text-blue-500" />
            <span>{formatMatchDate(upcomingMatches[0].scheduled_time)}</span>
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
        <p className="text-gray-600 mt-2">{team.bio || `Team ${team.name}`}</p>
      </div>

      {isTeamMember && (
        <>
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
        </>
      )}
    </div>
  );
}
