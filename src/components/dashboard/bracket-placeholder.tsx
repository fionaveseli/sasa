import { Card, CardContent } from "@/components/ui/card";

const bracketData = [
  ["Tigers", "Strikers", "Titans", "Infernos", "Shadows", "Phoenix", "Cipher", "Echo"], // Round 1
  ["RIT Tigers", "Titans", "Phoenix", "Cipher"], // Quarterfinals
  ["RIT Tigers", "Cipher"], // Semifinals
  ["?"] // Final (TBD)
];

export default function BracketCard() {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-lg text-[#353535] font-semibold">Bracket for RIT Kosovo Spring 2025</p>

        {/* Bracket Grid Layout */}
        <div className="mt-4 grid grid-cols-4 gap-x-10">
          {bracketData.map((round, roundIndex) => (
            <div
              key={roundIndex}
              className={`grid gap-y-${2 ** roundIndex} items-center`}
            >
              {round.map((team, teamIndex) => (
                <div key={teamIndex} className="relative flex items-center justify-center">
                  {/* Vertical Connector (Only for second round and beyond) */}
                  {roundIndex > 0 && (
                    <>
                      <div className="absolute left-[-10px] top-1/2 w-6 h-0.5 bg-purple-400"></div>
                      <div
                        className={`absolute left-[-10px] ${
                          teamIndex % 2 === 0 ? "top-0" : "bottom-0"
                        } w-0.5 h-full bg-purple-400`}
                      ></div>
                    </>
                  )}

                  {/* Team Box */}
                  <div className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-2 rounded-lg shadow-md w-32 text-center">
                    {team}
                  </div>

                  {/* Horizontal Connector (If not the last round) */}
                  {roundIndex < bracketData.length - 1 && (
                    <div className="absolute right-[-10px] top-1/2 w-6 h-0.5 bg-purple-400"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
