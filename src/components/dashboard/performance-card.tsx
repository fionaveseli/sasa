"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";

interface PerformanceCardProps {
  wins: number;
  totalMatches: number;
}

const COLORS = ["#C7FF33", "#4B0082"]; // 0 → wins (lime), 1 → losses (purple)

export default function PerformanceCard({
  wins,
  totalMatches,
}: PerformanceCardProps) {
  const [isClient, setIsClient] = useState(false);

  const winPercentage =
    totalMatches === 0 ? 0 : Math.round((wins / totalMatches) * 100);

  const data =
    totalMatches === 0
      ? [{ name: "No Matches", value: 1 }]
      : [
          { name: "Wins", value: wins },
          { name: "Losses", value: totalMatches - wins },
        ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className="flex flex-col items-center h-full shadow-lg rounded-xl">
      <CardContent className="p-4 w-full flex flex-col items-center">
        <p className="text-lg font-semibold text-[#353535]">
          Performance Overview
        </p>

        {isClient && (
          <div className="relative w-44 h-44 flex items-center justify-center">
            <PieChart width={120} height={120}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    /* purple ring when no matches, else normal palette */
                    fill={
                      totalMatches === 0
                        ? COLORS[1] // purple
                        : COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>
            </PieChart>
            <p className="absolute text-2xl text-[#353535]">{winPercentage}%</p>
          </div>
        )}

        <p className="text-sm mt-2 text-[#353535]">
          <span className="font-bold">{wins} wins</span> out of {totalMatches}{" "}
          matches
        </p>
      </CardContent>
    </Card>
  );
}
