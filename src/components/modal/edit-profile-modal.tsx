import { useState } from "react";
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

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Users | null;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: ""
  });

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
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
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 text-xs font-normal rounded-full border-[#6C2E9C] text-[#6C2E9C] hover:bg-[#6C2E9C] hover:text-white"
              >
                Upload Image
              </Button>
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

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Email</label>
              <Input 
                value={formData.email} 
                onChange={handleChange('email')}
                type="email"
                className="h-9"
                placeholder="Email"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Contact Number</label>
              <Input 
                value={formData.contactNumber}
                onChange={handleChange('contactNumber')}
              
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          variant="secondary"
          onClick={onClose}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
