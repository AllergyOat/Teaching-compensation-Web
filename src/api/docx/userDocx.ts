import { api } from "../client";

export const generateSchedulesDocx = async (formId: string, sectionId: string): Promise<Blob> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }
    const response = await api.get(
      `api/forms/${formId}/${sectionId}/generate-report`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to generate schedules DOCX:", error);
    throw new Error(
      error.response?.data?.message || "Failed to generate schedules DOCX."
    );
  } 
};

export const generateCompensationDocx = async (formId: string, sectionId: string): Promise<Blob> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }
    const response = await api.get(
      `api/forms/${formId}/${sectionId}/generate-compensation`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to generate schedules DOCX:", error);
    throw new Error(
      error.response?.data?.message || "Failed to generate schedules DOCX."
    );
  } 
};