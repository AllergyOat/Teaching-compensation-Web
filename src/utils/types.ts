// authentication form types
export type LoginFormInputs = {
  email: string;
  password: string;
};

export type RegisterFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

// Define specific types for form validation
export type MonthType =
  | "มกราคม"
  | "กุมภาพันธ์"
  | "มีนาคม"
  | "เมษายน"
  | "พฤษภาคม"
  | "มิถุนายน"
  | "กรกฎาคม"
  | "สิงหาคม"
  | "กันยายน"
  | "ตุลาคม"
  | "พฤศจิกายน"
  | "ธันวาคม";
export type SemesterType = "ภาคต้น" | "ภาคปลาย" | "ภาคฤดูร้อน";
export type ProgramType = "REGULAR_PROGRAM" | "SPECIAL_PROGRAM";
export type SectionType = "LECTURE" | "LAB";
export type KindType = "LECTURE" | "LAB";

// form and schedule types
export type Schedule = {
  date: string;
  time: string;
  totalHour?: number; // Optional since it's calculated from time
  topic: string;
  room: string;
  note: string | null;
};

export type Compensations = {
  originalDate: string;
  originalTime: string;
  newDate: string;
  newTime: string;
  reason: string;
}

export type LectureGroup = {
  lectureId: string;
  kind: KindType;
  totalHours: number;
  schedules: Schedule[];
  compensation?: Compensations[];
};

export type FormData = {
  form: {
    program: ProgramType;
    section: SectionType;
    month: MonthType;
    semester: SemesterType;
    year: number;
    subjectId: string;
    subjectName: string;
  };
  formScheduleDetails: LectureGroup[];
};
