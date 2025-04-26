"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api"; // Updated import to use our API service
import { useState } from "react";
import { Textarea } from "../ui/textarea";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTeamModal({
  isOpen,
  onClose,
}: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState("");
  const [teamBio, setTeamBio] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setLogo(event.target.files[0]);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setError("Team name is required");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      let logoUrl: string | undefined = undefined;
      
      // First upload the logo if one was selected
      if (logo) {
        try {
          logoUrl = await api.uploadLogo(logo);
          console.log("Logo uploaded successfully:", logoUrl);
        } catch (logoError: any) {
          console.error("Error uploading logo:", logoError);
          setError("Failed to upload logo: " + (logoError.message || "Unknown error"));
          setLoading(false);
          return;
        }
      }

      // Now create the team with the logo URL and bio
      console.log("Attempting to create team with name:", teamName);
      const team = await api.createTeam({
        name: teamName,
        bio: teamBio,
        logo: logoUrl,
      });

      console.log("Created team successfully:", team);

      // Show success message before reloading
      setError(null);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error("Error creating team:", err);
      // Detailed error message to help debug the issue
      let errorMessage = "Failed to create team: ";

      if (err.response) {
        // Server responded with an error
        errorMessage += `Server error (${err.response.status}): ${
          err.response.data?.message || JSON.stringify(err.response.data)
        }`;
        console.log("Server response data:", err.response.data);
      } else if (err.request) {
        // Request made but no response received
        errorMessage +=
          "No response from server. Check your network connection.";
      } else {
        // Something else caused the error
        errorMessage += err.message || "Unknown error";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-extralight">
            Create Team
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="flex flex-col gap-4 mt-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label className="block text-gray-700 ">
              Team Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 ">
              Team Bio <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={teamBio}
              onChange={(e) => setTeamBio(e.target.value)}
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700 ">
              Team Logo <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer">
              <input
                type="file"
                className="hidden"
                id="fileUpload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer text-gray-500"
              >
                {logo ? logo.name : "Drag & drop files or Browse"}
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            className="w-full bg-lime-400 text-black font-semibold hover:bg-lime-500"
            onClick={handleCreateTeam}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
