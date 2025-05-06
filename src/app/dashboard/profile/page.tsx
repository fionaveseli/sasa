"use client";

import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/app-context";
import { Pencil } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { RoleLabels } from "@/types/enums/AppRole";
import EditProfileModal from "@/components/modal/edit-profile-modal";
import { api } from "@/services/api";

export default function ProfilePage() {
  const { user, setUser } = useContext(AppContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [universityName, setUniversityName] = useState<string>("");

  const roleLabel = user?.role ? RoleLabels[user.role] : '';

  useEffect(() => {
    const fetchUniversityName = async () => {
      if (user?.university_id) {
        try {
          const universities = await api.getUniversities();
          const university = universities.find(u => u.id === user.university_id);
          if (university) {
            setUniversityName(university.name);
          }
        } catch (error) {
          console.error('Error fetching university:', error);
        }
      }
    };

    fetchUniversityName();
  }, [user?.university_id]);

  const handleProfileUpdate = async () => {
    try {
      const response = await api.getCurrentUser();
      const updatedUser = response.user;
      
      // Ensure graduationYear is a number
      if (updatedUser && updatedUser.graduationYear) {
        updatedUser.graduationYear = Number(updatedUser.graduationYear);
      }

      localStorage.setItem('USER', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">My Profile</h1>
      </div>

      <div className="flex items-start gap-4 pb-6">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
          <span className="text-2xl text-muted-foreground">
            {user?.fullName?.charAt(0)}
          </span>
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-medium">{user?.fullName}</h2>
          <p className="text-muted-foreground">{roleLabel}</p>
          {universityName && (
            <p className="text-sm text-muted-foreground">{universityName}</p>
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
            {universityName && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">University</p>
                <p>{universityName}</p>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Graduation Year</p>
              <p>{user?.graduationYear ? String(user.graduationYear) : 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSuccess={handleProfileUpdate}
      />
    </div>
  );
}