import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteTeamModal from "../modal/delete-team-modal";
import JoinTeamModal from "../modal/join-team-modal";
import LeaveTeamModal from "../modal/leave-team-modal";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface JoinTeamProps {
  teamId: number;
  image: string;
  teamName: string;
  university: string;
  members: string[];
  places: number;
  isUserTeam?: boolean;
  isUniversityManager?: boolean;
  onJoinSuccess?: () => void;
  disableJoin?: boolean;
  name: string;
  bio?: string;
}

export default function JoinTeam({
  teamId,
  image,
  teamName,
  university,
  members,
  places,
  isUserTeam = false,
  isUniversityManager = false,
  onJoinSuccess,
  disableJoin = false,
  name,
  bio,
}: JoinTeamProps) {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isFull = places === 0;

  return (
    <>
      <Card
        onClick={() => {
          if (isUserTeam || isUniversityManager) {
            localStorage.setItem(
              "selectedTeam",
              JSON.stringify({ id: teamId })
            );
            window.location.href = `/dashboard/teams/${teamId}`;
          }
        }}
        className={`p-2 h-full flex flex-col transition-all duration-200 ${
          isUserTeam
            ? "border-secondary border-2 cursor-pointer hover:shadow-lg"
            : "cursor-pointer"
        }`}
      >
        <CardContent className="flex p-2 pb-1 flex-col items-start text-center gap-2 flex-grow">
          {isUserTeam && (
            <Badge
              className="h-6 px-3 text-xs border-secondary "
              variant={"outline"}
            >
              Your Team
            </Badge>
          )}
          <div className="flex gap-2 items-start">
            <img
              src={image || "/teamtigers.svg"}
              alt="Team Logo"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                // Fallback if the team logo URL is invalid
                e.currentTarget.src = "/teamtigers.svg";
              }}
            />
          </div>

          <div className="text-start flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-800">
                {teamName}
              </h2>

              <p>
                <span className="text-gray-700">University:</span> {university}
              </p>

              <p>
                <span className="text-gray-700">Members:</span>{" "}
                <span className="text-primary">{members.join(", ")}</span>
              </p>

              <p>
                <span className="text-gray-700">Team Name:</span> {name}
              </p>

              <p>
                <span className="text-gray-700">Bio:</span> {bio}
              </p>
            </div>
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
          {isUniversityManager ? (
            <Button
              variant="destructive"
              size="sm"
              className="w-full flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
            >
              <Trash2 size={16} /> Delete Team
            </Button>
          ) : isUserTeam ? (
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                className="w-full"
                onClick={(e) => (
                  e.stopPropagation(), setIsLeaveModalOpen(true)
                )}
              >
                Leave Team
              </Button>
            </div>
          ) : (
            <Button
              variant="submit"
              className={`w-full ${
                isFull || disableJoin
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
              onClick={() =>
                !isFull && !disableJoin && setIsJoinModalOpen(true)
              }
              disabled={isFull || disableJoin}
            >
              {isFull ? "Full" : disableJoin ? "Already in a team" : "Join"}
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
      {isUniversityManager && (
        <DeleteTeamModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          teamName={teamName}
          teamId={teamId}
          onSuccess={onJoinSuccess}
        />
      )}
    </>
  );
}
