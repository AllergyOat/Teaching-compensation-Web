import { api } from "../client";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
  accessToken: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await api.post("/api/auth/login", { email, password });
  console.log("Login successful:", data);
  return data;
};

export const registerAPI = async (email: string, password: string): Promise<LoginResponse> => {
  const { data } = await api.post("/api/auth/register", { email, password });
  console.log("Registration successful:", data);
  return data;
};
