import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export default function MatchCard() {
  return (
    <Card className="h-full p-2 rounded-xl shadow-md bg-white">
      <CardContent className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6 h-full mt-4">
        <div className="flex sm:hidden w-full justify-between items-center">
          <div className="flex flex-col items-center">
            <span className="text-sm text-[#353535]">Wed</span>
            <span className="text-2xl font-bold">28</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="w-4 h-4 text-[#353535]" />
            <span className="text-sm">10:00 AM</span>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="w-4 h-4 text-[#353535]" />
            <span className="text-sm">10/02/2025</span>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-center justify-center border-r pr-4 h-full">
          <span className="text-sm text-[#353535]">Wed</span>
          <span className="text-2xl font-bold">28</span>
        </div>

        <div className="hidden sm:flex flex-col justify-center space-y-6 ">
          <div className="flex items-center space-x-2 text-[#353535]">
            <Clock className="w-4 h-4" />
            <span className="text-sm">10:00 AM</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-[#353535] ">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">10/02/2025</span>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-6 ">
          <span className="text-sm text-[#353535]">Match #8</span>
          <span className="text-sm text-[#353535]">RIT Kosovo Fall 2025</span>
        </div>

        <div className="flex sm:hidden w-full justify-center">
          <button className="bg-[#C7FF33] text-[#200936] px-4 py-2 font-semibold rounded-3xl shadow-md w-full">
            View Tournament
          </button>
        </div>

        <button className="hidden sm:block bg-[#C7FF33] text-[#200936] px-4 py-2 font-semibold rounded-3xl shadow-md">
          View Tournament
        </button>
      </CardContent>
    </Card>
  );
}
