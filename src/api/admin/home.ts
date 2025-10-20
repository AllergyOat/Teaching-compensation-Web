import axios from "axios";

export interface Root {
  myInformation: MyInformation;
  statistics: Statistics;
  usersWithForms: UsersWithForm[];
}

export interface MyInformation {
  firstName: any;
  lastName: any;
  role: string;
  major: any;
}

export interface Statistics {
  totalForms: number;
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
}

export interface UsersWithForm {
  userId: string;
  userName: string;
  userInfo: UserInfo;
  forms: Form[];
}

export interface UserInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  major?: string;
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
}

export interface FormScheduleDetail {
  sectionId: string;
}

export const getAdminHomeData = async (params?: {
  month?: string;
  year?: string;
  program?: string;
  search?: string;
}): Promise<Root> => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }

    const response = await axios.get("http://localhost:3000/api/admin/home", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching admin home data:", error);
    throw error;
  }
};
