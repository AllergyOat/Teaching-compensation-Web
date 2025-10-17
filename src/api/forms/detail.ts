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
  id: string;
  formId: string;
  sectionId: string;
  kind: string;
  schedules: Schedule[];
  compensation: any[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
}

export interface FormDetail {
  id: string;
  userId: string;
  isCompensated: boolean;
  program: string;
  section: string;
  month: string;
  semester: string;
  year: number;
  subjectId: string;
  subjectName: string;
  status: string;
  adminComment: string | null;
  createdAt: string;
  updatedAt: string;
  formScheduleDetails: FormScheduleDetail[];
  user: User;
}

export interface FormDetailResponse {
  message: string;
  data: FormDetail;
}

export const getFormDetail = async (
  formId: string,
): Promise<FormDetailResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }

    const response = await axios.get(
      `http://localhost:3000/api/forms/${formId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch form detail:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }

    throw error;
  }
};
