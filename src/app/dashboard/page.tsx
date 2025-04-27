"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BracketCard from "@/components/dashboard/bracket-placeholder";
import MatchCard from "@/components/dashboard/match-card";
import PerformanceCard from "@/components/dashboard/performance-card";
import TeamCard from "@/components/dashboard/team-card";
import { api, DashboardStats, Match, Team, BracketRound } from "@/services/api";
import { MoonLoader } from "react-spinners";
import BannerCard from "@/components/dashboard/banner-card";
import { AppContext } from "@/context/app-context";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingMatch, setUpcomingMatch] = useState<Match | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [bracket, setBracket] = useState<BracketRound[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useContext(AppContext);
  const role = user?.role || "student";
  const formattedRole = role.replace(/_/g, " ");
  const title = `Hi ${
    formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1)
  }`;
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Try to get the team info
        let teamData = null;
        try {
          teamData = await api.getCurrentTeam();
          setTeam(teamData);
        } catch (teamError) {
          console.log(
            "No team found for this user, continuing without team data"
          );
        }

        // Try to get tournament data
        let tournamentData = null;
        let matchesData: Match[] = [];
        let bracketData: BracketRound[] = [];

        try {
          tournamentData = await api.getCurrentTournament();
          if (tournamentData) {
            // Get matches and bracket only if we have a tournament
            matchesData = await api.getUpcomingMatches();
            bracketData = await api.getTournamentBracket();
          }
        } catch (tournamentError) {
          console.log(
            "No tournament found, continuing without tournament data"
          );
        }

        if (matchesData.length > 0) {
          setUpcomingMatch(matchesData[0]);
        }

        setBracket(bracketData.length > 0 ? bracketData : null);

        // Get stats last, as it depends on team and tournament data
        try {
          const statsData = await api.getDashboardStats();
          console.log("[dashboard] statsData", statsData); // ← inspect this
          setStats(statsData);
        } catch (statsError) {
          console.log("Could not get stats, using defaults");
          setStats({
            wins: 0,
            totalMatches: 0,
            tournaments: 0,
          });
        }
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);

        // If we get a 401 error, the token is invalid
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] w-full">
        <MoonLoader size={20} color="#200936" />
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

  return (
    <div className="flex flex-col space-y-4">
      {/* <h1 className="text-2xl font-normal">
        Welcome, {user?.fullName || team?.players[0]?.fullName || "User"}
      </h1> */}

      <div className="grid min-h-fit grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-1 sm:col-span-2 md:col-span-3">
            <BannerCard
              title={title}
              description="The tournament gates are open — are you ready?"
              button="Let's Play"
              role={role}
            />
          </div>
          {/* <StatsCard
            title="No. of Wins"
            value={stats?.wins.toString() || "0"}
          />
          <StatsCard
            title="Total Matches"
            value={stats?.totalMatches.toString() || "0"}
          />
          <StatsCard
            title="Tournaments"
            value={stats?.tournaments.toString() || "0"}
          /> */}

          <div className="col-span-1 sm:col-span-2 md:col-span-3">
            {upcomingMatch ? (
              <MatchCard match={upcomingMatch} />
            ) : (
              <div className="p-4 border rounded-md text-center">
                No upcoming matches scheduled
              </div>
            )}
          </div>

          <div className="col-span-1 sm:col-span-2 md:col-span-3">
            {bracket ? (
              <BracketCard rounds={bracket} />
            ) : (
              <div className="p-4 border rounded-md text-center">
                No bracket available
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          <PerformanceCard
            wins={stats?.wins || 0}
            totalMatches={stats?.totalMatches || 0}
          />
          {team ? (
            <TeamCard team={team} />
          ) : (
            <div className="p-4 border rounded-md text-center">
              No team information available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
