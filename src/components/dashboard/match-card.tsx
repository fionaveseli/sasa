import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Match } from "@/services/api";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const date = new Date(match.scheduled_time);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayNumber = date.getDate();
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="h-full p-2 rounded-xl shadow-md bg-white">
      <CardContent className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6 h-full mt-4">
        <div className="flex sm:hidden w-full justify-between items-center">
          <div className="flex flex-col items-center">
            <span className="text-sm text-[#353535]">{dayName}</span>
            <span className="text-2xl font-bold">{dayNumber}</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="w-4 h-4 text-[#353535]" />
            <span className="text-sm">{time}</span>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="w-4 h-4 text-[#353535]" />
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-center justify-center border-r pr-4 h-full">
          <span className="text-sm text-[#353535]">{dayName}</span>
          <span className="text-2xl font-bold">{dayNumber}</span>
        </div>

        <div className="hidden sm:flex flex-col justify-center space-y-6">
          <div className="flex items-center space-x-2 text-[#353535]">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{time}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-[#353535]">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <span className="text-sm text-[#353535]">
            Match #{match.match_number}
          </span>
          <span className="text-sm text-[#353535]">
            {match.team1.name} vs {match.team2.name}
          </span>
        </div>

        <button className="bg-[#C7FF33] text-[#200936] px-4 py-2 font-semibold rounded-3xl shadow-md w-full">
          View Tournament
        </button>
      </CardContent>
    </Card>
  );
}
