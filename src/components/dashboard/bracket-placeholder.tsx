"use client";
import { Bracket, IRoundProps } from "@sportsgram/brackets";
import { Card, CardContent } from "@/components/ui/card";
import type { BracketRound } from "@/api/tournamentService";

interface BracketCardProps {
  rounds: BracketRound[];
}

export default function BracketCard({ rounds }: BracketCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-lg text-[#353535] font-semibold">
          Bracket for RIT Kosovo Spring 2025
        </p>

        <div className="mt-4">
          <Bracket rounds={rounds} />
        </div>
      </CardContent>
    </Card>
  );
}
