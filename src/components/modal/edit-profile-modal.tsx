import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Users } from "@/types/dto/users/Users";
import { api } from "@/services/api";
import { toast } from "sonner";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Users | null;
  onSuccess?: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    graduationYear: new Date().getFullYear().toString(),
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        graduationYear: user.graduationYear?.toString() || new Date().getFullYear().toString(),
      });
    }
  }, [user, isOpen]);


  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await api.updateProfile({
        fullName: formData.fullName,
        graduationYear: formData.graduationYear,
      });
      toast.success("Profile updated successfully");
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="flex justify-between items-center space-y-0">
          <DialogTitle className="text-xl font-normal text-center w-full">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Picture */}
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-3">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl text-muted-foreground">
                  {user?.fullName?.charAt(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Name</label>
              <Input 
                value={formData.fullName} 
                onChange={handleChange('fullName')} 
                className="h-9"
                placeholder="Name"
              />
            </div>

            {/* Graduation Year */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Graduation Year</label>
              <Input 
                value={formData.graduationYear}
                onChange={handleChange('graduationYear')}
                type="number"
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 10}
                className="h-9"
                placeholder="Graduation Year"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          variant="secondary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
