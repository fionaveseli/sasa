"use client";

import { useEffect, useState } from "react";
import JoinTeam from "@/components/dashboard/join-team";
import CreateTeamModal from "@/components/modal/create-team-modal";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { getUniversityTeams, Team } from "@/api/teamService";

export default function TeamsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("USER")!)
      : null;
  const universityId = user?.university_id;

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem("TOKEN");
      if (!token || !universityId) {
        setError("Missing token or university ID.");
        setLoading(false);
        return;
      }

      try {
        const res = await getUniversityTeams(universityId, token);
        if (res.data) {
          setTeams(res.data.teams);
        } else {
          setError("Failed to load teams.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [universityId]);

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-normal">Teams</h1>

      <div className="flex justify-between">
        <SearchInput
          handleSearch={(search) => console.log(search)}
          placeholder="Search..."
        />
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          Create Team
        </Button>
      </div>

      {loading ? (
        <p>Loading teams...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {teams.map((team) => (
            <JoinTeam
              key={team.id}
              teamId={team.id}
              image="/logo1.svg"
              teamName={team.name}
              university={user?.university || "Your University"}
              members={team.players.map((p: any) => p.name ?? "Player")}
              places={3 - team.players.length} // Adjust this if your max team size differs
            />
          ))}
        </div>
      )}

      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
