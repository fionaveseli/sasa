import axiosInstance from "@/utils/axios";

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

export const getUsersFromUniversity = async (
  universityId: number,
): Promise<{ users: UniversityUser[] }> => {
  const response = await axiosInstance.get(`/universities/${universityId}/users`);
  return response.data;
};

// NOTE: /users/all is not in the backend contract
export const getAllUsersFromAllUniversities = async (): Promise<{
  universities: any[];
}> => {
  const response = await axiosInstance.get("/users/all");
  return response.data;
};
