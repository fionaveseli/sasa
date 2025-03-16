import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const [name, setName] = useState("fiona");
  const [contact, setContact] = useState("+383 49 500 600");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 rounded-lg">
        {/* Header */}
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-extralight">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        {/* Profile Picture Upload */}
        <div className="flex items-center gap-4 mt-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-lg">👤</span>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Image
          </Button>
        </div>

        {/* Form Fields */}
        <div className="mt-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-600 text-sm">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Email (Disabled) */}
          <div>
            <label className="block text-gray-600 text-sm">Email</label>
            <Input value="violaosmani@rit.edu" disabled />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-600 text-sm">
              Contact Number
            </label>
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-6 items-center">
          <Button variant={"secondary"}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
