import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import JoinTeamModal from "../modal/join-team-modal";
import LeaveTeamModal from "../modal/leave-team-modal";

interface JoinTeamProps {
  teamId: number;
  image: string;
  teamName: string;
  university: string;
  members: string[];
  places: number;
  isUserTeam?: boolean;
  onJoinSuccess?: () => void;
}

export default function JoinTeam({
  teamId,
  image,
  teamName,
  university,
  members,
  places,
  isUserTeam = false,
  onJoinSuccess,
}: JoinTeamProps) {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const isFull = places === 0;

  return (
    <>
      <Card
        className={`p-3 h-full flex flex-col ${
          isUserTeam ? "border-secondary border-2" : ""
        }`}
      >
        <CardContent className="flex p-4 pb-1 flex-col items-center text-center gap-2 flex-grow">
          <div className="flex gap-2 items-center">
            <img
              src={image}
              alt="Team Logo"
              className="w-12 h-12 rounded-full"
            />
            <h2 className="text-xl font-semibold">
              {teamName}
              {isUserTeam && (
                <span className="ml-2 text-xs bg-secondary text-black px-2 py-1 rounded-full">
                  Your Team
                </span>
              )}
            </h2>
          </div>
          <div className="text-start flex flex-col gap-2 flex-grow">
            <p className="text-gray-600">University: {university}</p>
            <p className="text-gray-600">Members: {members.join(", ")}</p>
            <div
              className={`text-sm font-medium px-3 py-1 rounded-md w-fit ${
                isFull
                  ? "bg-gray-200 text-gray-600"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {places} {places === 1 ? "place" : "places"} left!
            </div>
          </div>
        </CardContent>
        <div className="p-2 mt-auto w-full">
          {isUserTeam ? (
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setIsLeaveModalOpen(true)}
              >
                Leave Team
              </Button>
            </div>
          ) : (
            <Button
              variant="submit"
              className={`w-full ${
                isFull ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
              }`}
              onClick={() => !isFull && setIsJoinModalOpen(true)}
              disabled={isFull}
            >
              {isFull ? "Full" : "Join"}
            </Button>
          )}
        </div>
      </Card>
      <JoinTeamModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        teamName={teamName}
        teamId={teamId}
        onSuccess={onJoinSuccess}
      />
      {isUserTeam && (
        <LeaveTeamModal
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          teamName={teamName}
          teamId={teamId}
          onSuccess={onJoinSuccess}
        />
      )}
    </>
  );
}
