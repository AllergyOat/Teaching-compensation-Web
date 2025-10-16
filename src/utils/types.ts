// authentication form types
export type LoginFormInputs = {
  email: string;
  password: string;
}

export type RegisterFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
}

// Define specific types for form validation
export type MonthType = "มกราคม" | "กุมภาพันธ์" | "มีนาคม" | "เมษายน" | "พฤษภาคม" | "มิถุนายน" | "กรกฎาคม" | "สิงหาคม" | "กันยายน" | "ตุลาคม" | "พฤศจิกายน" | "ธันวาคม";
export type SemesterType = "ภาคต้น" | "ภาคปลาย" | "ภาคฤดูร้อน";
type KindType = "LECTURE" | "LAB";

// form and schedule types
export type Schedule = {
  date: string;
  time: string;
  totalHour: number;
  topic: string;
  room: string;
  note: string | null;
};

export type LectureGroup = {
  lectureId: string;
  kind: KindType;
  schedules: Schedule[];
};

export type FormData = {
  form: {
    program: string;
    section: string;
    month: MonthType;
    semester: SemesterType;
    year: number;
    subjectId: string;
    subjectName: string;
  };
  formScheduleDetails: LectureGroup[];
};