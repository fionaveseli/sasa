"use client";

import { useState } from "react";
import { Edit, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditProfileModal from "@/components/modal/edit-profile-modal";

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Dummy profile data
  const profile = {
    name: "Fiona Veseli",
    role: "Team Player",
    university: "RIT Kosovo",
    email: "fionav@rit.edu",
    contact: "+383 49 500 600",
    avatar: "", // Empty for now (placeholder)
  };

  return (
    <div>
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="mt-4 bg-white p-6 rounded-xl shadow-md relative">
        {/* Edit Button */}

        {/* Profile Info */}
        <div className="flex justify-between">
          <div className="flex items-center gap-6">
            {/* Profile Image */}
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              {/* Placeholder Avatar */}
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full"
                />
              ) : (
                <div className="text-gray-400 text-lg">👤</div>
              )}
            </div>

            {/* Profile Details */}
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600">{profile.role}</p>
              <p className="text-gray-600">{profile.university}</p>
            </div>
          </div>
          <Button variant={"secondary"} onClick={() => setIsModalOpen(true)}>
            Edit Profile
          </Button>
        </div>

        {/* Personal Information */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {/* Name */}
            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="text-black">{profile.name}</p>
            </div>

            {/* Role */}
            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <p className="text-black">{profile.role}</p>
            </div>

            {/* Email */}
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-black">{profile.email}</p>
            </div>

            {/* Contact Number */}
            <div>
              <p className="text-gray-500 text-sm">Contact Number</p>
              <p className="text-black">{profile.contact}</p>
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
