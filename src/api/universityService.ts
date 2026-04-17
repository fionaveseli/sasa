import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import type { Team } from "@/api/teamService";

export interface University {
  id: number;
  name: string;
  email_domain: string;
  location: string;
  contact_info: string;
  logo: string | null;
  banner_color: string;
  bio: string;
  manager_id: number;
  createdAt: string;
  updatedAt: string;
}

export const getUniversities = async (): Promise<{ universities: University[] }> => {
  const response = await axiosInstance.get("/universities");
  return response.data;
};

export const createUniversity = async (data: {
  universityName: string;
  universityAddress: string;
  contactNumber: string;
  logo?: string;
  bannerColor: string;
  bio: string;
}) => {
  const response = await axiosInstance.post("/universities", data);

  if (response.data?.user && response.data?.token) {
    localStorage.setItem("USER", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
  }

  toast.success("University created successfully!");
  return response.data;
};

export const getUniversityUsers = async (universityId: number) => {
  const response = await axiosInstance.get(
    `/universities/${universityId}/users`,
  );
  return response.data;
};

export const getUniversityTeams = async (universityId: number): Promise<{ teams: Team[] }> => {
  const response = await axiosInstance.get(
    `/universities/${universityId}/teams`,
  );
  return response.data;
};

export const getUniversityTournaments = async (universityId: number) => {
  const response = await axiosInstance.get(
    `/universities/${universityId}/tournaments`,
  );
  return response.data;
};

export const joinUniversity = async (data: { universityId: string }) => {
  const response = await axiosInstance.patch("/users/me", data);
  toast.success("Successfully joined university!");
  return response.data;
};

// TODO: confirm /universities/:id/transfer-manager exists in backend
export const transferManagerRole = async (
  universityId: number,
  newManagerId: number,
) => {
  const response = await axiosInstance.post(
    `/universities/${universityId}/transfer-manager`,
    { new_manager_user_id: newManagerId },
  );
  return response.data;
};
