import axios from "axios";

export interface Root {
  message: string
  data: Data
}

export interface Data {
  id: string
  userId: string
  isCompensated: boolean
  program: string
  section: string
  month: string
  semester: string
  year: number
  subjectId: string
  subjectName: string
  status: string
  adminComment: any
  createdAt: string
  updatedAt: string
  formScheduleDetails: FormScheduleDetail[]
  user: User
  totalHourAmount: number
  grandTotal: number
}

export interface FormScheduleDetail {
  id: string
  formId: string
  sectionId: string
  kind: string
  schedules: Schedule[]
  compensation: any[]
  totalHours: number
  amount: number
}

export interface Schedule {
  id: string
  formSectionId: string
  date: string
  time: string
  totalHour: number
  topic: string
  room: string
  note: string | null
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  position: string
  department: string
}

export const getFormDetail = async (
  formId: string,
): Promise<Root> => {
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
