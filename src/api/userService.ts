import axiosInstance, { getRequest } from "@/utils/axios";
import { ApiResponse } from "@/types/dto/Axios";

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/users/me");
  return response.data;
};

export const updateProfile = async (data: {
  fullName: string;
  graduationYear: string;
}) => {
  const response = await axiosInstance.patch("/users/profile", data);
  return response.data;
};

export const updateUserRole = async (userId: number, newRole: string) => {
  const response = await axiosInstance.patch(`/users/${userId}/role`, {
    role: newRole,
  });
  return response.data;
};

export type UniversityUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  graduationYear: number;
};

export const getUsersFromUniversity = (
  universityId: number,
): Promise<ApiResponse<{ users: UniversityUser[] }>> =>
  getRequest<{ users: UniversityUser[] }>(
    `/universities/${universityId}/users`,
  );

// NOTE: /users/all is not in the backend contract
export const getAllUsersFromAllUniversities = (): Promise<
  ApiResponse<{ universities: any[] }>
> => getRequest<{ universities: any[] }>("/users/all");
