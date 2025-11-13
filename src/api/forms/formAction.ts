import { api } from "../client";

export const createForm = async (formData: any): Promise<any> => {
  try {
    const response = await api.post("api/forms/create-form", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating form:", error);
    throw error;
  }
};

export const editForm = async (formId: string, formData: any): Promise<any> => {
  try {
    const response = await api.put(`api/forms/edit-form/${formId}`, formData);
    return response.data;
  } catch (error: any) {
    console.error("Failed to edit form:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

export const deleteForm = async (formId: string): Promise<any> => {
  try {
    const response = await api.delete(`api/forms/${formId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to delete form:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};
