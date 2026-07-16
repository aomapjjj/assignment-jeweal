import axios from "@/lib/axios";

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "SALES";
  };
}

export const login = async (
  data: LoginDto
): Promise<LoginResponse> => {
  const response = await axios.post("/auth/login", data);

  return response.data;
};