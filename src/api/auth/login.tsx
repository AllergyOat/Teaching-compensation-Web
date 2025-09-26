import axios from "axios";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
  accessToken: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
