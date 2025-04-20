"use client";

import { useEffect, useState } from "react";
import JoinTeam from "@/components/dashboard/join-team";
import CreateTeamModal from "@/components/modal/create-team-modal";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { api, Team } from "@/services/api";
import { useRouter } from "next/navigation";
import axios from "axios";

// Extended Team interface with additional UI properties
interface ExtendedTeam extends Team {
  isUserTeam?: boolean;
  university_name?: string;
}

export default function TeamsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState<ExtendedTeam[]>([]);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTeams = async () => {
      try {
        // Get the current user
        const userData = await api.getCurrentUser();
        const universityId = userData.user.university_id;

        if (!universityId) {
          setError("You are not associated with a university");
          setLoading(false);
          return;
        }

        // Get all teams from the user's university
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://web-production-3dd4c.up.railway.app/api";
        const response = await axios.get(
          `${API_BASE_URL}/university/${universityId}/teams`
        );
        let allTeams: ExtendedTeam[] = response.data.teams || [];

        // Add university name to each team
        allTeams = allTeams.map((team) => ({
          ...team,
          university_name:
            userData.user.university_name || `University ID: ${universityId}`,
        }));

        // Try to get the user's current team
        try {
          const userTeamData = await api.getCurrentTeam();
          setUserTeam(userTeamData);

          // Mark the user's team in the list
          allTeams = allTeams.map((team) => ({
            ...team,
            isUserTeam: team.id === userTeamData.id,
          }));
        } catch (teamError) {
          console.log("User is not part of a team");
          // No team for the user, that's fine
        }

        setTeams(allTeams);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load teams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [router]);

  // Function to handle team refresh after joining/creating
  const handleTeamChange = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-normal">Teams</h1>

      <div className="flex justify-between">
        <SearchInput
          handleSearch={(search) => console.log(search)}
          placeholder="Search..."
        />
        <Button
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
          disabled={userTeam !== null}
        >
          {userTeam ? "Already in a team" : "Create Team"}
        </Button>
      </div>

      {loading ? (
        <p>Loading teams...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {userTeam && (
            <div className="bg-purple-50 p-4 rounded-md mb-4">
              {/* <h2 className="text-lg font-semibold text-green-800">
                Your Team
              </h2> */}
              <p className="text-primary">
                You are currently a member of team{" "}
                <strong>{userTeam.name}</strong>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teams.map((team) => (
              <JoinTeam
                key={team.id}
                teamId={team.id}
                image="/logo.svg"
                teamName={team.name}
                university={team.university_name || "University"}
                members={(team.players || []).map(
                  (p) => p.fullName || "Player"
                )}
                places={2 - (team.players || []).length}
                isUserTeam={team.isUserTeam}
                onJoinSuccess={handleTeamChange}
              />
            ))}

            {teams.length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-8">
                No teams found. Be the first to create a team!
              </p>
            )}
          </div>
        </>
      )}

      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
