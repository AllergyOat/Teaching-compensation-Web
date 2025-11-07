import axios from "axios";

export interface SemesterTrackingData {
  subjectId: string;
  subjectName: string;
  program: string;
  semester: string;
  section: string;
  sections: Section[];
}

export interface Section {
  sectionId: string;
  kind: string;
  totalHoursRequired: number;
  hoursUsed: number;
  hoursRemaining: number;
}

export interface SemesterTrackingResponse {
  data: SemesterTrackingData[];
}

export const getSemesterTracking = async (params: {
  semester: string;
  year: number;
  program?: string;
  section?: string;
}): Promise<SemesterTrackingResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }
    
    const response = await axios.get(
      `http://localhost:3000/api/forms/tracking`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params,
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching semester tracking:", error);
    throw error;
  }
};
