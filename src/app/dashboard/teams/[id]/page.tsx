"use client";

import CreateTeamModal from "@/components/modal/create-team-modal";
import LeaveTeamModal from "@/components/modal/leave-team-modal";
import { Button } from "@/components/ui/button";
import { Match, Team } from "@/services/api";
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

        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://web-production-3dd4c.up.railway.app/api";

        // Fetch current user to check team membership
        const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();

        // Fetch all universities
        const universitiesResponse = await fetch(
          `${API_BASE_URL}/uni/universities-g`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!universitiesResponse.ok) {
          throw new Error("Failed to fetch universities");
        }

        const universities = await universitiesResponse.json();

        // Try to find the team in each university
        let foundTeam = null;
        for (const university of universities.universities) {
          const teamsResponse = await fetch(
            `${API_BASE_URL}/university/${university.id}/teams`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (teamsResponse.ok) {
            const teamsJson = await teamsResponse.json();
            const team = teamsJson.teams.find(
              (team: Team) => team.id === Number(id)
            );
            if (team) {
              foundTeam = team;
              break;
            }
          }
        }

        if (!foundTeam) {
          throw new Error("Team not found");
        }

        setTeam(foundTeam);

        // Check if current user is a team member
        const isMember = foundTeam.players.some(
          (player: { email: any }) => player.email === userData.user.email
        );
        setIsTeamMember(isMember);

        // Fetch tournament matches
        const tournamentResponse = await fetch(
          `${API_BASE_URL}/tournament/current`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (tournamentResponse.ok) {
          const tournament = await tournamentResponse.json();

          const matchesResponse = await fetch(
            `${API_BASE_URL}/tournament/${tournament.id}/matches`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (matchesResponse.ok) {
            const matches = await matchesResponse.json();
            const teamMatches = matches.filter(
              (match: Match) =>
                (match.team1_id === Number(id) ||
                  match.team2_id === Number(id)) &&
                new Date(match.scheduled_time) > new Date() &&
                match.status === "scheduled"
            );
            teamMatches.sort(
              (a: Match, b: Match) =>
                new Date(a.scheduled_time).getTime() -
                new Date(b.scheduled_time).getTime()
            );
            setUpcomingMatches(teamMatches);
          }
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

  const getWins = () => {
    return team?.wins || 0;
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
          <span>{getWins()} Times Winner</span>
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
