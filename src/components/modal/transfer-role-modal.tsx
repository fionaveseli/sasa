"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { api } from "@/services/api"; // ✅ Import the API
import { useState } from "react";
import { toast } from "sonner"; // ✅ For success/error messages

interface TransferRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    id: string;
    name: string;
    email: string;
  };
  onTransferSuccess: () => void;
  universityId: number; // ✅ Add this prop!
}

export default function TransferRoleModal({
  isOpen,
  onClose,
  candidate,
  onTransferSuccess,
  universityId, 
}: TransferRoleModalProps) {
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    setLoading(true);
    try {
      await api.transferUniversityManagerRole(universityId, parseInt(candidate.id));
      
      toast.success(`Successfully transferred role to ${candidate.name}!`);
      onTransferSuccess(); // Notify parent
      onClose(); // Close modal
    } catch (error: any) {
      console.error("Error transferring role:", error);
      toast.error(error.response?.data?.message || "Failed to transfer role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Transfer University Manager Role
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Important Notice</p>
              <p>
                You are about to transfer your University Manager role to{" "}
                <span className="font-medium">{candidate.name}</span>. This action
                cannot be undone.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4 space-y-3">
            <h3 className="font-medium text-sm text-gray-900">New Manager Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">{candidate.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{candidate.email}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleTransfer} disabled={loading}>
              {loading ? "Transferring..." : "Transfer Role"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
