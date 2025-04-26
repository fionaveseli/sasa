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
  const [isUniversityManager, setIsUniversityManager] = useState(false);
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
        const userRole = userData.user.role;

        // Check if user is a university manager
        setIsUniversityManager(userRole === "university_manager");

        if (!universityId) {
          setError("You are not associated with a university");
          setLoading(false);
          return;
        }

        // Get university details first
        const universitiesResponse = await api.getUniversities();
        const universityData = universitiesResponse.find(uni => uni.id === universityId);
        const universityName = universityData?.name || "";

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
          university_name: universityName
        }));

        // If not a university manager, try to get the user's current team
        if (!isUniversityManager) {
          try {
            const userTeamData = await api.getCurrentTeam();
            setUserTeam(userTeamData);

            // Mark the user's team in the list
            allTeams = allTeams.map((team) => ({
              ...team,
              isUserTeam: team.id === userTeamData.id,
            }));
          } catch (teamError: any) {
            console.log("User is not part of a team:", teamError.message);
            setUserTeam(null);
          }
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
          disabled={userTeam !== null || isUniversityManager}
        >
          {isUniversityManager
            ? "University Managers cannot join teams"
            : userTeam
            ? "Already in a team"
            : "Create Team"}
        </Button>
      </div>

      {loading ? (
        <p>Loading teams...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {isUniversityManager && (
            <div className="bg-purple-50 p-4 rounded-md mb-4">
              <p className="text-primary">
                As a University Manager, you can delete teams but cannot join or
                create teams.
              </p>
            </div>
          )}

          {userTeam && !isUniversityManager && (
            <div className="bg-purple-50 p-4 rounded-md mb-4">
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
                university={team.university_name || ""}
                members={(team.players || []).map(
                  (p) => p.fullName || "Player"
                )}
                places={2 - (team.players || []).length}
                isUserTeam={team.isUserTeam}
                isUniversityManager={isUniversityManager}
                onJoinSuccess={handleTeamChange}
                disableJoin={userTeam !== null}
                name={team.name}
                sport={team.sport}
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
