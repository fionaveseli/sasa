"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AppContext } from "@/context/app-context";
import { createTournament } from "@/api/tournamentService";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export default function CreateTournamentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useContext(AppContext);
  const userRole = user?.role;

  const isDisabled = userRole !== "university_manager";

  const [formData, setFormData] = useState({
    name: "",
    type: "university",
    registrationDeadline: "",
    startDate: "",
    endDate: "",
    universityId: user?.universityId || 0,
    bracketType: "single_elimination",
    description: "",
    rules: "",
    timeZone: "UTC",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      universityId: user?.universityId || 0,
    }));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) {
      toast.error("You don't have permission to create tournaments");
      return;
    }
    setIsLoading(true);

    try {
      const response = await createTournament(formData);
      if (response) {
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (userRole === "student") {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={isDisabled}>Create Tournament</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[600px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create New Tournament</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tournament Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tournament Type</Label>
            <Select
              name="type"
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationDeadline">Registration Deadline</Label>
            <Input
              id="registrationDeadline"
              name="registrationDeadline"
              type="datetime-local"
              value={formData.registrationDeadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bracketType">Bracket Type</Label>
            <Select
              name="bracketType"
              value={formData.bracketType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, bracketType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bracket type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_elimination">
                  Single Elimination
                </SelectItem>
                <SelectItem value="double_elimination">
                  Double Elimination
                </SelectItem>
                <SelectItem value="round_robin">Round Robin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rules">Rules</Label>
            <Textarea
              id="rules"
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Tournament"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
