import { Card } from "@/components/ui/card";

export default function TeamCard() {
  return (
    <Card className="flex flex-col items-center text-center shadow-lg rounded-xl p-6 space-y-2">
      {/* Team Logo */}
      <img
        src="/path-to-team-logo.png"
        className="w-20 h-20 mx-auto rounded-full shadow-md"
        alt="Team Logo"
      />

      {/* Team Name */}
      <p className="text-xl font-semibold text-[#353535]">RIT Tigers</p>

      {/* University Info */}
      <p className="text-sm text-[#353535]">University: RIT Kosovo</p>

      {/* Members List */}
      <p className="text-sm text-[#353535]">
        <span className="font-semibold">Members:</span> John Smith <br /> Jane
        Smith
      </p>

      {/* View Team Button */}
      <button className="w-full bg-[#C7FF33] text-black font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-[#B6F233] transition">
        View Team Page
      </button>
    </Card>
  );
}
