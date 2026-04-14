import { AppRole } from "@/types/enums/AppRole";

export interface Users {
  id: number;
  fullName: string;
  email: string;
  role: AppRole;
  graduationYear: number;
  timeZone: string;
  universityId?: number;
  createdAt: string;
  updatedAt: string;
}
