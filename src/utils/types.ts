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
  schedules: Schedule[];
};

export type FormData = {
  form: {
    program: string;
    section: string;
    month: string;
    semester: string;
    year: number;
    subjectId: string;
    subjectName: string;
  };
  formScheduleDetails: LectureGroup[];
};