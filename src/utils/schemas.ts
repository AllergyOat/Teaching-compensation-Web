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
  date: z.string().min(1, { message: "วันที่ไม่สามารถว่างได้" }),
  time: z.string().min(1, { message: "เวลาไม่สามารถว่างได้" }),
  totalHour: z.number().positive({ message: "จำนวนชั่วโมงต้องมากกว่า 0" }),
  topic: z.string().min(1, { message: "หัวข้อการสอนไม่สามารถว่างได้" }),
  room: z.string().min(1, { message: "ห้องเรียนไม่สามารถว่างได้" }),
  note: z.string().nullable(),
});

export const lectureGroupSchema = z.object({
  lectureId: z.string().min(1, { message: "รหัสหมู่เรียนไม่สามารถว่างได้" }),
  kind: z.enum(["ภาคต้น", "ภาคปลาย", "ภาคฤดูร้อน"], { 
    message: "กรุณาเลือกภาคการศึกษา" 
  }),
  schedules: z.array(scheduleSchema).min(1, { message: "ต้องมีตารางสอนอย่างน้อย 1 รายการ" }),
  note: z.string().nullable().optional(),
});

export const formInputSchema = z.object({
  form: z.object({
    program: z.string().min(1, { message: "หลักสูตรไม่สามารถว่างได้" }),
    section: z.string().min(1, { message: "สาขาวิชาไม่สามารถว่างได้" }),
    month: z.enum([
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ], { message: "กรุณาเลือกเดือน" }),
    semester: z.enum(["ภาคต้น", "ภาคปลาย", "ภาคฤดูร้อน"], {
      message: "กรุณาเลือกภาคการศึกษา"
    }),
    year: z.number().min(2500, { message: "ปีการศึกษาไม่ถูกต้อง" }),
    subjectId: z.string().min(1, { message: "รหัสรายวิชาไม่สามารถว่างได้" }),
    subjectName: z.string().min(1, { message: "ชื่อรายวิชาไม่สามารถว่างได้" }),
  }),
  formScheduleDetails: z.array(lectureGroupSchema).min(1, { message: "ต้องมีข้อมูลหมู่เรียนอย่างน้อย 1 หมู่" }),
});
