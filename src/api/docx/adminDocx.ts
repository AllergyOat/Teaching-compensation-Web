import axios from "axios";

export const genereteOutput1Docx = async (formId: string, sectionId: string): Promise<Blob> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }
    const response = await axios.get(
      `http://localhost:3000/api/forms/${formId}/${sectionId}/generate-docx`,
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

export const genereteOutput2Docx = async (formId: string, sectionId: string): Promise<Blob> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }
    const response = await axios.get(
      `http://localhost:3000/api/forms/${formId}/${sectionId}/generate-evidence`,
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

export const generateOutput3Docx = async (formId: string, sectionId: string): Promise<Blob> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }
    const response = await axios.get(
      `http://localhost:3000/api/forms/${formId}/${sectionId}/generate-sumschedule`,
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
}

