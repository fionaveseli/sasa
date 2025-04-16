import { ApiResponse } from "@/types/dto/Axios";
import { Token } from "@/types/dto/users/AuthToken";

import { Login } from "@/types/dto/users/Login";
import { RegisterUser } from "@/types/dto/users/RegisterUser";
import { Users } from "@/types/dto/users/Users";
import { getRequest, postRequest } from "@/utils/axios";

export const login = (
  data: Login
): Promise<ApiResponse<{ user: Users; token: string }>> =>
  postRequest<{ user: Users; token: string }, Login>("api/auth/login", data);

type RegisterResponse = {
  user: Users;
  authToken: string;
};
export const registerUser = (
  data: RegisterUser
): Promise<ApiResponse<RegisterResponse>> =>
  postRequest<RegisterResponse, RegisterUser>("api/auth/register", data);

export type University = {
  id: number;
  name: string;
  // Add other fields if needed
};
// 1. Get all universities
export const getUniversities = (): Promise<ApiResponse<University[]>> =>
  getRequest<University[]>("uni/universities-g");

// 2. Check if any exist
export const checkIfUniversitiesExist = async (): Promise<boolean> => {
  try {
    const res = await getUniversities();
    return Array.isArray(res.data) && res.data.length > 0;
  } catch (err) {
    console.error("Failed to fetch universities", err);
    return false;
  }
};
