import { api } from "../client";

export interface Root {
  forms: Form[];
  summary: Summary;
  graph1: Graph1[];
  graph2: Graph2[];
  graph3: Graph3[];
  graph4: Graph4[];
}

export interface Form {
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
  adminComment?: string;
  createdAt: string;
  updatedAt: string;
  formScheduleDetails: FormScheduleDetail[];
  totalHours: number;
  amount: number;
}

export interface FormScheduleDetail {
  sectionId: string;
  schedules: Schedule[];
  compensation: Compensation[];
}

export interface Schedule {
  id: string;
  formSectionId: string;
  date: string;
  time: string;
  totalHour: number;
  topic: string;
  room: string;
  note?: string;
}

export interface Compensation {
  id: string;
  formSectionId: string;
  originalScheduleId: any;
  originalDate: string;
  originalTime: string;
  newDate: string;
  newTime: string;
  reason: string;
}

export interface Summary {
  user: User;
  lecture: Lecture;
  lab: Lab;
  grand: Grand;
}

export interface User {
  firstName: string;
  lastName: string;
  department: string;
  major: string;
}

export interface Lecture {
  totalHours: number;
  totalAmount: number;
  formsCount: number;
}

export interface Lab {
  totalHours: number;
  totalAmount: number;
  formsCount: number;
}

export interface Grand {
  totalHours: number;
  totalAmount: number;
  formsCount: number;
}

export interface Graph1 {
  month: string;
  Lecture: number;
  Lab: number;
}

export interface Graph2 {
  month: string;
  totalAmount: number;
}

export interface Graph3 {
  semester: string;
  totalLectureHours: number;
  maxLectureHours: number;
  totalLabHours: number;
  maxLabHours: number;
}

export interface Graph4 {
  semester: string;
  formsCount: number;
}

export const getAdminTeacherDetail = async (
  userId: string,
  year: number,
  params?: {
    program?: string;
    month?: string;
    section?: string;
  },
): Promise<Root> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }
    const response = await api.get(
      `api/admin/users-dashboard/${year}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching admin teacher detail data:", error);
    throw error;
  }
};
