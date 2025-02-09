import BracketCard from "@/components/dashboard/bracket-placeholder";
import MatchCard from "@/components/dashboard/match-card";
import PerformanceCard from "@/components/dashboard/performance-card";
import StatsCard from "@/components/dashboard/stats-card";
import TeamCard from "@/components/dashboard/team-card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-2xl font-normal">Welcome, John</h1>

      {/* Responsive Container */}
      <div className="grid min-h-fit grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Section: Stats + Match + Bracket */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stats (Show one per row on small screens) */}
          <StatsCard title="No. of Wins" value="5" />
          <StatsCard title="Total Matches" value="20" />
          <StatsCard title="Tournaments" value="2" />

          {/* Next Match Info (Single Column on Small Screens) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <MatchCard />
          </div>

          {/* Bracket (Single Column on Small Screens) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <BracketCard />
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Performance Overview */}
          <div>
            <PerformanceCard />
          </div>

          {/* Team Info */}
          <div>
            <TeamCard />
          </div>
        </div>
      </div>
    </div>
  );
}
