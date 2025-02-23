"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Wins", value: 5 },
  { name: "Losses", value: 15 },
];

const COLORS = ["#C7FF33", "#4B0082"];

export default function PerformanceCard() {
  const [isClient, setIsClient] = useState(false);

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
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
            <p className="absolute text-2xl text-[#353535]">25%</p>
          </div>
        )}

        <p className="text-sm mt-2 text-[#353535]">
          <span className="font-bold">5 wins</span> out of 20 matches
        </p>
      </CardContent>
    </Card>
  );
}
