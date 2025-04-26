"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TabsModel from "@/components/tabs-model";
import { TabsType } from "@/types/dto/TabsType";
import { Shield, Eye, EyeOff, Search, RefreshCw } from "lucide-react";
import ShadcnTable from "@/components/table";
import type { ColumnDef } from "@tanstack/react-table";

interface FormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Student {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

enum Tabs {
  Security = "Security",
  RoleTransfer = "Role Transfer",
}

const allowedViews = ["Security", "Role Transfer"];

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<FormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [students] = useState<Student[]>([
    {
      id: 1,
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      role: "Team Player"
    }
  ]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("Please fill in all password fields");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    // Show message that feature is not available yet
    setError("Password change feature is not available yet");
  };

  const renderPasswordField = (
    label: string,
    name: keyof FormState,
    show: boolean,
    setShow: (show: boolean) => void
  ) => (
    <div>
      <label className="text-sm text-[#6C2E9C] mb-2 block">{label}</label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className="pr-10 h-10 bg-white border border-gray-200 rounded-md w-full"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={() => setShow(!show)}
        >
          <span className="text-gray-400">
            {show ? (
              <Eye size={18} className="text-gray-400" />
            ) : (
              <EyeOff size={18} className="text-gray-400" />
            )}
          </span>
        </button>
      </div>
    </div>
  );

  const filteredStudents = students.filter(student => 
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<Student>[] = [
    { accessorKey: "fullName", header: "NAME" },
    { accessorKey: "email", header: "EMAIL" },
    { accessorKey: "role", header: "ROLE", cell: () => "Team Player" },
    {
      id: "roleTransfer",
      header: "ROLE TRANSFER",
      cell: () => (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            className="px-4 py-1 rounded-full text-sm flex items-center justify-center group"
          >
            <RefreshCw
              size={18}
              className="transition-transform duration-300 group-hover:rotate-180"
            />
          </Button>
        </div>
      ),
    },
  ];

  const tabs: TabsType[] = [
    {
      key: "Security",
      value: Tabs.Security,
      label: "Security",
      component: (
        <div className="bg-white p-4">
          <h2 className="text-2xl font-medium mb-6">Change Password</h2>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="w-full">
                  {renderPasswordField(
                    "Current Password",
                    "currentPassword",
                    showCurrentPassword,
                    setShowCurrentPassword
                  )}
                </div>
                <div className="w-full"></div>
              </div>

              <div className="flex gap-6">
                <div className="w-full">
                  {renderPasswordField(
                    "New Password",
                    "newPassword",
                    showNewPassword,
                    setShowNewPassword
                  )}
                </div>
                <div className="w-full">
                  {renderPasswordField(
                    "Confirm New Password",
                    "confirmPassword",
                    showConfirmPassword,
                    setShowConfirmPassword
                  )}
                </div>
              </div>
            </div>

            {error && <div className="text-[#FF3B30] text-sm">{error}</div>}

            <Button
              type="submit"
              className="bg-[#CCFF00] text-black hover:bg-[#b8e600] px-8 rounded-full h-9 text-sm font-normal"
            >
              Save
            </Button>
          </form>
        </div>
      ),
    },
    {
      key: "Role Transfer",
      value: Tabs.RoleTransfer,
      label: "Role Transfer",
      component: (
        <div className="bg-white p-4">
          <h2 className="text-2xl font-medium mb-4">Select a New University Manager</h2>
          <p className="text-gray-600 mb-6">Choose a user from your university to transfer the role to.</p>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          <ShadcnTable
            columns={columns}
            rows={filteredStudents}
            loading={false}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-normal mb-6">Settings</h1>
      <div className="bg-white rounded-xl overflow-hidden [&_[role=tablist]]:!w-48">
        <TabsModel
          tabs={tabs}
          defaultTab={Tabs.Security}
          viewPermissions={allowedViews}
        />
      </div>
    </div>
  );
}
