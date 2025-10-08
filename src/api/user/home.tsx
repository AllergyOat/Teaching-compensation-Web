import axios from "axios";

export interface Schedule {
  id: string;
  formSectionId: string;
  date: string;
  time: string;
  totalHour: number;
  topic: string;
  room: string;
  note: string | null;
}

export interface FormScheduleDetail {
  sectionId: string;
  schedules: Schedule[];
}

export interface Form {
  id: string;
  subjectId: string;
  subjectName: string;
  program: string;
  section: string;
  month: string;
  semester: string;
  year: number;
  status: string;
  createdAt: string;
  formScheduleDetails: FormScheduleDetail[];
}

export interface HomeResponse {
  total_forms: number;
  totalHour: number;
  months: Record<string, boolean>;
  forms: Form[];
}

export const getHomeData = async (): Promise<HomeResponse> => {
  try {
    // Get the access token from localStorage
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }

    const response = await axios.get("http://localhost:3000/api/user/home", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch home data:", error);

    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }

    throw error;
  }
};
