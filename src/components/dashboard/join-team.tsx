import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import JoinTeamModal from "../modal/join-team-modal";

interface JoinTeamProps {
  image: string;
  teamName: string;
  university: string;
  members: string[];
  places: number;
}

export default function JoinTeam({
  image,
  teamName,
  university,
  members,
  places,
}: JoinTeamProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Card className="p-3 h-full flex flex-col">
        <CardContent className="flex p-4 pb-1 flex-col items-center text-center gap-2 flex-grow">
          <div className="flex gap-2">
            <img
              src={image}
              alt="Team Logo"
              className="w-12 h-12 rounded-full"
            />
            <h2 className="text-xl font-semibold">{teamName}</h2>
          </div>
          <div className="text-start flex flex-col gap-2 flex-grow">
            <p className="text-gray-600">University: {university}</p>
            <p className="text-gray-600">Members: {members.join(", ")}</p>
            {places > 0 && (
              <div className="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-md w-fit">
                {places} {places === 1 ? "place" : "places"} left!
              </div>
            )}
          </div>
        </CardContent>
        <div className="p-2 mt-auto w-full">
          <Button
            variant="submit"
            className="w-full"
            onClick={() => setIsModalOpen(true)}
          >
            Join
          </Button>
        </div>
      </Card>
      <JoinTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teamName={teamName}
      />
    </>
  );
}
