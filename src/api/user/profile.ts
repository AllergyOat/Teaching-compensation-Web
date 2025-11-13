import { api } from "../client";

export interface ProfileData {
  firstName: string;
  lastName: string;
  degree: string;
  position: string;
  department: string;
  faculty: string;
  major: string;
  type: string;
  teachingLevel: string;
  email: string;
}

export interface ProfileResponse {
  message: string;
  data?: any;
}

export const getProfile = async (): Promise<ProfileData> => {
  try {
    const response = await api.get("api/user/profile");
    return response.data.user;
  } catch (error: any) {
    console.error("Failed to get profile:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

export const updateProfile = async (
  profileData: ProfileData,
): Promise<ProfileResponse> => {
  try {
    const response = await api.post("api/user/profile", profileData);
    return response.data;
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};
