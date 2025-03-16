import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
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
  const [members, setMembers] = useState("");
  const [teamBio, setTeamBio] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setLogo(event.target.files[0]);
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
            <label className="block text-gray-700 ">Members</label>
            <Input
              value={members}
              onChange={(e) => setMembers(e.target.value)}
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
            onClick={() => alert("Team Created!")}
          >
            Create Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
