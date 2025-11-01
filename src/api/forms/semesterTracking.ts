import axios from "axios";

export interface Root {
  data: Daum[]
}

export interface Daum {
  subjectId: string
  subjectName: string
  sections: Section[]
}

export interface Section {
  sectionId: string
  kind: string
  totalHoursRequired: number
  hoursUsed: number
  hoursRemaining: number
}

export const getSemesterTracking = async (
  semester: string,
  year: number,
  program: string,
  section: string,
): Promise<Root> => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }

    const response = await axios.get(
      `http://localhost:3000/api/forms/tracking?semester=${semester}&year=${year}&program=${program}&section=${section}`,
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
