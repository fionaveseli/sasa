"use client";

import { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface PerformanceCardProps {
  stats: {
    wins: number;
    totalMatches: number;
  };
}

export default function PerformanceCard({ stats }: PerformanceCardProps) {
  const [isClient, setIsClient] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);

  // Handle animation
  useEffect(() => {
    setIsClient(true);
    setIsSpinning(true);
    setAnimatedValue(0);

    const spinTimer = setTimeout(() => {
      setIsSpinning(false);
      if (stats.totalMatches === 0) {
        setAnimatedValue(100);
      } else {
        const percentage = (stats.wins / stats.totalMatches) * 100;
        setAnimatedValue(percentage);
      }
    }, 1000);

    return () => clearTimeout(spinTimer);
  }, [stats]);

  const chartData = [
    {
      name: "Wins",
      value: animatedValue,
      fill: stats.wins > 0 ? "#C7FF33" : "#4B0082" 
    },
  ];

  return (
    <Card className="flex flex-col items-center h-full shadow-md rounded-xl">
      <CardContent className="p-4 w-full flex flex-col items-center">
        {isClient && (
          <div className={`relative w-[250px] h-[250px] flex items-center justify-center ${isSpinning ? 'animate-spin' : ''}`}>
            <RadialBarChart
              width={250}
              height={250}
              innerRadius="70%"
              outerRadius="100%"
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                background={{ fill: "#4B0082" }}
                dataKey="value"
                cornerRadius={50}
                animationDuration={1000}
              />
            </RadialBarChart>

            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold text-[#353535]">
                {stats.wins}
              </span>
              <span className="text-sm text-[#353535]">Wins</span>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-[#353535] text-center">
          <div className="font-medium">
            {stats.wins} wins out of {stats.totalMatches} matches
          </div>
          <div className="text-muted-foreground mt-1">
            Showing total wins in current tournament
          </div>
        </div>
      </CardContent>
    </Card>
  );
}