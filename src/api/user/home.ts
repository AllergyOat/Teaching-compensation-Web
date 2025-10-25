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

export interface Compensations {
  originalDate: string;
  originalTime: string;
  newDate: string;
  newTime: string;
  reason: string;
}

export interface FormScheduleDetail {
  sectionId: string;
  schedules: Schedule[];
  compensation: Compensations[]; 
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

export interface TotalAmount {
  labAmount: number
  lectureAmount: number
}

export interface HomeResponse {
  total_forms: number;
  totalHour: number;
  totalLectureHours: number;
  totalLabHours: number;
  totalAmount: TotalAmount
  user: {
    id: string;
    firstName: string;
    lastName: string;
    degree: string;
    position: string;
    department: string;
    faculty: string;
    major: string;
    type: string;
    teachingLevel: string;
    createdAt: string;
  };
  forms: Form[];
}

export const getHomeData = async (params?: {
  month?: string;
  year?: string;
}): Promise<HomeResponse> => {
  try {
    // Get the access token from localStorage
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }

    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.month) queryParams.append("month", params.month);
    if (params?.year) queryParams.append("year", params.year);

    const queryString = queryParams.toString();
    const url = queryString
      ? `http://localhost:3000/api/user/home?${queryString}`
      : "http://localhost:3000/api/user/home";

    const response = await axios.get(url, {
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
