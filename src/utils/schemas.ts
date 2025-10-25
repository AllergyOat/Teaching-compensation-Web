import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const scheduleSchema = z.object({
  date: z.string().min(1, { message: "วันที่" }),
  time: z.string().min(1, { message: "เวลา" }),
  totalHour: z.number().optional(), // Optional since it's calculated from time
  topic: z.string().min(1, { message: "หัวข้อการสอน" }),
  room: z.string().min(1, { message: "ห้องเรียน" }),
  note: z.string().nullable(),
});

export const compensationSchema = z.object({
  originalDate: z.string().min(1, { message: "วันที่สอนเดิม" }),
  originalTime: z.string().min(1, { message: "เวลาสอนเดิม" }),
  newDate: z.string().min(1, { message: "วันที่สอนจริง" }),
  newTime: z.string().min(1, { message: "เวลาสอนจริง" }),
  reason: z.string().min(1, { message: "เหตุผลการสอนทดแทน" }),
});

export const lectureGroupSchema = z.object({
  lectureId: z.string().min(1, { message: "กรุณากรอกรหัสหมู่เรียน" }),
  kind: z.enum(["LECTURE", "LAB"], {
    message: "กรุณาเลือกประเภทการสอน",
  }),
  schedules: z
    .array(scheduleSchema)
    .min(1, { message: "ต้องมีตารางสอนอย่างน้อย 1 รายการ" }),
  compensation: z.array(compensationSchema).optional(),
});

export const formInputSchema = z.object({
  form: z.object({
    program: z.enum(["REGULAR_PROGRAM", "SPECIAL_PROGRAM"], {
      message: "กรุณาเลือกหลักสูตร",
    }),
    section: z.enum(["LECTURE", "LAB"], {
      message: "กรุณาเลือกประเภทการสอน",
    }),
    month: z.enum(
      [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ],
      { message: "กรุณาเลือกเดือน" },
    ),
    semester: z.enum(["ภาคต้น", "ภาคปลาย", "ภาคฤดูร้อน"], {
      message: "กรุณาเลือกภาคการศึกษา",
    }),
    year: z.number().min(2500, { message: "ปีการศึกษาไม่ถูกต้อง" }),
    subjectId: z.string().min(1, { message: "กรุณากรอกรหัสรายวิชา" }),
    subjectName: z.string().min(1, { message: "กรุณากรอกชื่อรายวิชา" }),
  }),
  formScheduleDetails: z
    .array(lectureGroupSchema)
    .min(1, { message: "ต้องมีข้อมูลหมู่เรียนอย่างน้อย 1 หมู่" }),
});
