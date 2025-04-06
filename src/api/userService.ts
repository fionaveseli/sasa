import { ApiResponse } from "@/types/dto/Axios";
import { AuthToken } from "@/types/dto/users/AuthToken";
import { Login } from "@/types/dto/users/Login";
import { RegisterUser } from "@/types/dto/users/RegisterUser";
import { Users } from "@/types/dto/users/Users";
import { postRequest } from "@/utils/axios";

export const login = (
    data: Login
  ): Promise<ApiResponse<{ user: Users; authToken: AuthToken }>> =>
    postRequest<{ user: Users; authToken: AuthToken }, Login>(
      "api/auth/login", 
      data
    );

    type RegisterResponse = {
      user: Users;
      authToken: string;
    };
    export const registerUser = (
      data: RegisterUser
    ): Promise<ApiResponse<RegisterResponse>> =>
      postRequest<RegisterResponse, RegisterUser>("api/auth/register", data);
    