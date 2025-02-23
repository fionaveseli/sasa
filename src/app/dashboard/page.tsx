import BracketCard from "@/components/dashboard/bracket-placeholder";
import MatchCard from "@/components/dashboard/match-card";
import PerformanceCard from "@/components/dashboard/performance-card";
import StatsCard from "@/components/dashboard/stats-card";
import TeamCard from "@/components/dashboard/team-card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="text-2xl font-normal">Welcome, John</h1>

      <div className="grid min-h-fit grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatsCard title="No. of Wins" value="5" />
          <StatsCard title="Total Matches" value="20" />
          <StatsCard title="Tournaments" value="2" />

          <div className="col-span-1 sm:col-span-2 md:col-span-3">
            <MatchCard />
          </div>

          <div className="col-span-1 sm:col-span-2 md:col-span-3">
            <BracketCard />
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          <PerformanceCard />
          <TeamCard />
        </div>
      </div>
    </div>
  );
}
