"use client";

import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/app-context";
import { Pencil } from "lucide-react";
import { useContext, useState } from "react";
import { RoleLabels } from "@/types/enums/AppRole";
import EditProfileModal from "@/components/modal/edit-profile-modal";

export default function ProfilePage() {
  const { user } = useContext(AppContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const roleLabel = user?.role ? RoleLabels[user.role] : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">My Profile</h1>
      </div>

      <div className="flex items-start gap-4 pb-6">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
          {/* Placeholder for profile image */}
          <span className="text-2xl text-muted-foreground">
            {user?.fullName?.charAt(0)}
          </span>
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-medium">{user?.fullName}</h2>
          <p className="text-muted-foreground">{roleLabel}</p>
          {user?.university_id && (
            <p className="text-sm text-muted-foreground">RIT Kosovo</p>
          )}
        </div>
        <Button 
          size="sm" 
          variant="secondary" 
          className="ml-auto gap-2"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Name</p>
              <p>{user?.fullName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Role</p>
              <p>{roleLabel}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{user?.email}</p>
            </div>
            {user?.graduationYear && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Graduation Year</p>
                <p>{user.graduationYear}</p>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Time Zone</p>
              <p>{user?.timeZone}</p>
            </div>
            {user?.university_id && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">University</p>
                <p>RIT Kosovo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </div>
  );
}
