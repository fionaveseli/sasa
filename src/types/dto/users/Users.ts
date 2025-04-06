import { AppRole } from "@/types/enums/AppRole";

export interface Users {
  id: number;
  fullName: string;
  email: string;
  role: AppRole;
  graduationYear: number;
  timeZone: string;
  university_id?: number;
  createdAt: string;
  updatedAt: string;
}
