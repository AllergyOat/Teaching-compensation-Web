import axios from "axios";

export interface UpdateStatusResponse {
  message: string;
}

export interface UpdateStatus {
  status: string;
  adminComment?: string;
}

export const updateFormStatus = async (
  formId: string,
  statusData: UpdateStatus,
): Promise<UpdateStatusResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found. Please login first.");
    }

    const response = await axios.put(
      `http://localhost:3000/api/admin/forms/${formId}/status`,
      statusData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Failed to update form status:", error);

    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }

    // Handle forbidden access
    if (error.response?.status === 403) {
      throw new Error("You don't have permission to update form status.");
    }

    // Handle not found
    if (error.response?.status === 404) {
      throw new Error("Form not found.");
    }

    throw error;
  }
};
