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
  token: string;
};
export const registerUser = (
  data: RegisterUser
): Promise<ApiResponse<RegisterResponse>> =>
  postRequest<RegisterResponse, RegisterUser>("api/auth/register", data);

export type University = {
  id: number;
  name: string;
};
export const getUniversities = (
  token: string
): Promise<ApiResponse<{ universities: University[] }>> =>
  getRequest<{ universities: University[] }>("api/uni/universities-g", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const checkIfUniversitiesExist = async (
  token: string
): Promise<boolean> => {
  try {
    const res = await getUniversities(token);
    return Array.isArray(res.data) && res.data.length > 0;
  } catch (err) {
    console.error("Failed to fetch universities", err);
    return false;
  }
};

export const createUniversity = (
  data: {
    universityName: string;
    universityAddress: string;
    contactNumber: string;
    logo?: string;
    bannerColor: string;
    bio: string;
  },
  token: string
) =>
  postRequest("api/uni/universities-r", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export type UniversityUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  graduationYear: number;
};

export const getUsersFromUniversity = (
  universityId: number,
  token: string
): Promise<ApiResponse<{ users: UniversityUser[] }>> =>
  getRequest<{ users: UniversityUser[] }>(
    `/api/uni/universities/${universityId}/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  export const getAllUsersFromAllUniversities = (token: string): Promise<ApiResponse<{ universities: any[] }>> =>
    getRequest<{ universities: any[] }>("/api/users/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });