"use client";
import { Bracket, IRoundProps } from "@sportsgram/brackets";
import { Card, CardContent } from "@/components/ui/card";

const bracketRounds: IRoundProps[] = [
  {
    title: "Quarterfinals",
    seeds: [
      { id: 1, teams: [{ name: "Tigers" }, { name: "Strikers" }] },
      { id: 2, teams: [{ name: "Titans" }, { name: "Infernos" }] },
      { id: 3, teams: [{ name: "Shadows" }, { name: "Phoenix" }] },
      { id: 4, teams: [{ name: "Cipher" }, { name: "Echo" }] },
    ],
  },
  {
    title: "Semifinals",
    seeds: [
      {
        id: 5,
        teams: [{ name: "RIT Tigers" }, { name: "Titans" }],
      },
      { id: 6, teams: [{ name: "Phoenix" }, { name: "Cipher" }] },
    ],
  },
  {
    title: "Final",
    seeds: [{ id: 7, teams: [{ name: "?" }, { name: "?" }] }],
  },
];

export default function BracketCard() {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-lg text-[#353535] font-semibold">
          Bracket for RIT Kosovo Spring 2025
        </p>

        <div className="mt-4">
          <Bracket rounds={bracketRounds}  />
        </div>
      </CardContent>
    </Card>
  );
}
