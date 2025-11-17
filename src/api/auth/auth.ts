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

export const forgetPassword = async (email: string): Promise<{ message: string }> => {
  const { data } = await api.post("/api/auth/forgot-password", { email });
  console.log("Forget password request successful:", data);
  return data;
}

export const verifyOtp = async (email: string, otp: string): Promise<{ message: string, valid: boolean }> => {
  const { data } = await api.post("/api/auth/verify-reset-otp", { email, otp });
  console.log("OTP verification successful:", data);
  return data;
}

export const resetPassword = async (email: string, otp: string, newPassword: string): Promise<{ message: string }> => {
  const { data } = await api.post("/api/auth/reset-password", { email, otp, newPassword });
  console.log("Password reset successful:", data);
  return data;
}