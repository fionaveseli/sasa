import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Gamepad2, PartyPopper } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
}

const getIcon = (title: string) => {
  switch (title) {
    case "No. of Wins":
      return <PartyPopper className="w-10 h-10 text-[#4F1787]" />;
    case "Total Matches":
      return <Gamepad2 className="w-10 h-10 text-[#4F1787]" />;
    case "Tournaments":
      return <Trophy className="w-10 h-10 text-[#4F1787]" />;
    default:
      return null;
  }
};

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex-row items-center gap-4">
        {getIcon(title)}
        <div>
          <p className="text-lg font-extralight text-[#353535]">{title}</p>
          <p className="text-3xl font-normal">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
