import { api } from "../client";

export interface Root {
  users: User[]
}

export interface User {
  id: string
  firstName?: string
  lastName?: string
  degree?: string
  position?: string
  department?: string
  faculty?: string
  major?: string
  createdAt: string
}

export const getAdminUsers = async (params?: {
  search?: string;
}): Promise<Root> => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }

    const response = await api.get("api/admin/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching admin users data:", error);
    throw error;
  }
};
