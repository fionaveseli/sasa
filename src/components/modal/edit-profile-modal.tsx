import { useState, useEffect } from "react";
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
  const [error, setError] = useState<string | null>(null);

  // Fetch user data when modal opens
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.getCurrentUser();
        if (response.user) {
          setFormData({
            fullName: response.user.fullName || "",
            graduationYear: response.user.graduationYear?.toString() || new Date().getFullYear().toString(),
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load profile data");
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setError(null);
    
    if (field === 'graduationYear') {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate form data
      if (!formData.fullName.trim()) {
        setError("Name is required");
        return;
      }

      // Update profile
      await api.updateProfile({
        fullName: formData.fullName.trim(),
        graduationYear: formData.graduationYear,
      });

      // Update local storage with new user data
      const updatedUser = await api.getCurrentUser();
      if (updatedUser.user) {
        localStorage.setItem("USER", JSON.stringify(updatedUser.user));
      }

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
            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Name</label>
              <Input 
                value={formData.fullName} 
                onChange={handleChange('fullName')} 
                className="h-9"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Graduation Year */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Graduation Year</label>
              <Input 
                value={formData.graduationYear}
                onChange={handleChange('graduationYear')}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="h-9"
                required
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          variant="secondary"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}