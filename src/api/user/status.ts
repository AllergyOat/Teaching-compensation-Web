import axios from "axios";

type StatusCounts = {
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
};

type Form = {
  id: string;
  subjectId: string;
  subjectName: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment: string | null;
};

type ProfileData = {
  statusCounts: StatusCounts;
  forms: Form[];
};

type StatusParams = {
  program?: string;
  month?: string;
  year?: string;
};

export const getStatus = async (params?: StatusParams): Promise<ProfileData> => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }

    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.program) queryParams.append("program", params.program);
    if (params?.month) queryParams.append("month", params.month);
    if (params?.year) queryParams.append("year", params.year);
    
    const queryString = queryParams.toString();
    const url = `http://localhost:3000/api/user/status${queryString ? `?${queryString}` : ""}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

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
