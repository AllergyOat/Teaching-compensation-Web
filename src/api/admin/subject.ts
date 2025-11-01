import { api } from "../client";

// Types for Subject Section Rate
export interface SectionDetail {
  id: string;
  sectionId: string;
  kind: "LECTURE" | "LAB";
  MaxTotalHours: number;
  ratePerHour: number;
  teacherTotalHours: number | null;
}

export interface SubjectSectionRateGroup {
  id: string;
  subjectId: string;
  subjectName: string;
  program: "REGULAR_PROGRAM" | "SPECIAL_PROGRAM";
  semester: "ภาคต้น" | "ภาคปลาย" | "ภาคฤดูร้อน";
  section: "LECTURE" | "LAB";
  sections: SectionDetail[];
}

export interface CreateSubjectSectionRateRequest {
  sections: {
    subjectId: string;
    subjectName: string;
    section: "LECTURE" | "LAB";
    sectionId: string;
    program: "REGULAR_PROGRAM" | "SPECIAL_PROGRAM";
    kind: "LECTURE" | "LAB";
    semester: "ภาคต้น" | "ภาคปลาย" | "ภาคฤดูร้อน";
    ratePerHour: number;
    maxTotalHours: number;
    teacherTotalHours: number | null;
  }[];
}

export interface UpdateSubjectSectionRateRequest {
  sections: {
    subjectId: string;
    subjectName: string;
    section: "LECTURE" | "LAB";
    sectionId: string;
    program: "REGULAR_PROGRAM" | "SPECIAL_PROGRAM";
    kind: "LECTURE" | "LAB";
    semester: "ภาคต้น" | "ภาคปลาย" | "ภาคฤดูร้อน";
    ratePerHour: number;
    maxTotalHours: number;
    teacherTotalHours: number | null;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Create new subject section rates
export const createSubjectSectionRate = async (
  data: CreateSubjectSectionRateRequest
): Promise<ApiResponse<{
  created: any[];
  skipped: any[];
  trackingCreated: number;
}>> => {
  try {
    const response = await api.post("/api/admin/subject-section-rates", data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating subject section rate:", error);
    throw error.response?.data || error;
  }
};

// Get all subject section rates
export const listSubjectSectionRates = async (
  semester?: string
): Promise<ApiResponse<SubjectSectionRateGroup[]>> => {
  try {
    const params = semester ? { semester } : {};
    const response = await api.get("/api/admin/subject-section-rates", { params });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching subject section rates:", error);
    throw error.response?.data || error;
  }
};

// Get subject section rate by id
export const getSubjectSectionRateById = async (
  id: string
): Promise<ApiResponse<SubjectSectionRateGroup[]>> => {
  try {
    const response = await api.get(`/api/admin/subject-section-rates/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching subject section rate by id:", error);
    throw error.response?.data || error;
  }
};

// Update subject section rate
export const updateSubjectSectionRate = async (
  id: string,
  data: UpdateSubjectSectionRateRequest
): Promise<ApiResponse<{
  updated: any[];
  skipped: any[];
}>> => {
  try {
    const response = await api.put(
      `/api/admin/subject-section-rates/${id}`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating subject section rate:", error);
    throw error.response?.data || error;
  }
};

// Delete subject section rate (deletes all records with same subjectId)
export const deleteSubjectSectionRate = async (
  id: string
): Promise<ApiResponse<{
  subjectId: string;
  deletedCount: number;
  deletedRecords: any[];
}>> => {
  try {
    const response = await api.delete(`/api/admin/subject-section-rates/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting subject section rate:", error);
    throw error.response?.data || error;
  }
};