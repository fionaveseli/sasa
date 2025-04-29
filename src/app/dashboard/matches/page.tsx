"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MatchesTable from "@/components/matches-table";
import TabsModel from "@/components/tabs-model";
import type { TabsType } from "@/types/dto/TabsType";

interface Match {
  id: string;
  date: string;
  time: string;
  teamA: {
    name: string;
    avatar: string;
    score: number;
  };
  teamB: {
    name: string;
    avatar: string;
    score: number;
  };
}

enum Tabs {
  Matches = "Matches",
  Bracket = "Bracket",
  Teams = "Teams",
}

export default function MatchesPage() {
  const tabs: TabsType[] = [
    {
      key: "Matches",
      value: Tabs.Matches,
      label: "Matches",
      component: (
        <div>
          <MatchesTable />
        </div>
      ),
    },
    {
      key: "Bracket",
      value: Tabs.Bracket,
      label: "Bracket",
      component: <div className="p-6">Bracket content goes here</div>,
    },
    {
      key: "Teams",
      value: Tabs.Teams,
      label: "Teams",
      component: <div className="p-6">Teams content goes here</div>,
    },
  ];

  const allowedViews = ["Matches", "Bracket", "Teams"];

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">RIT Kosovo Fall 2024</h1>
        </div>
        <Badge variant="outline">Upcoming</Badge>
        <div className="flex items-center gap-2 ml-auto bg-white px-3 py-1 rounded-md border">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">01/12/2024 - 10/12/2024</span>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <TabsModel
          tabs={tabs}
          defaultTab={Tabs.Matches}
          viewPermissions={allowedViews}
        />
      </div>
    </div>
  );
}
