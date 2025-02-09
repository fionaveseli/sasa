import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export default function MatchCard() {
  return (
    <Card className="p-1 rounded-xl shadow-md bg-white">
      <CardContent className="flex items-center justify-between space-x-6 h-20">
        {/* Left Section - Date */}
        <div className="flex flex-col items-center justify-center border-r pr-4 mt-4 h-full">
          <span className="text-sm text-[#353535]">Wed</span>
          <span className="text-2xl font-bold">28</span>
        </div>

        {/* Middle Section - Match Details */}
        <div className="flex flex-col justify-center space-y-6 mt-4">
          <div className="flex items-center space-x-2 text-[#353535]">
            <Clock className="w-4 h-4" />
            <span className="text-sm">10:00 AM</span>
          </div>
          <div className="flex items-center space-x-2 text-[#353535]">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">10/02/2025</span>
          </div>
        </div>

        {/* Match Name */}
        <div className="flex flex-col justify-center space-y-6 mt-4">
          <span className="text-sm text-[#353535]">Match #8</span>
          <span className="text-sm text-[#353535]">RIT Kosovo Fall 2025</span>
        </div>

        {/* Button */}
        <button className="bg-[#C7FF33] text-[#200936] px-4 py-2 font-semibold rounded-3xl shadow-md mt-4">
          View Tournament
        </button>
      </CardContent>
    </Card>
  );
}
