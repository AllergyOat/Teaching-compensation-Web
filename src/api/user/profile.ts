import axios from "axios";

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
}

export interface ProfileResponse {
  message: string;
  data?: any;
}

export const getProfile = async (): Promise<ProfileData> => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }

    const response = await axios.get("http://localhost:3000/api/user/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // API returns { user: {...} }
    return response.data.user;
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

export const updateProfile = async (
  profileData: ProfileData,
): Promise<ProfileResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }

    const response = await axios.post(
      "http://localhost:3000/api/user/profile",
      profileData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to update profile:", error);

    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }

    throw error;
  }
};
