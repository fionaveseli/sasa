import axiosInstance from "@/utils/axios";

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (userData: {
  fullName: string;
  email: string;
  password: string;
  graduationYear: number;
  timeZone: string;
  role?: string;
}) => {
  const response = await axiosInstance.post("/auth/register", userData);
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await axiosInstance.post("/auth/change-password", data);
  return response.data;
};
