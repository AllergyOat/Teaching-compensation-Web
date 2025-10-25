import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFormDetail, type FormDetailResponse as FormDetailType } from "../../api/forms/detail";
import documentsImg from "@/assets/images/documents.png";
import { LectureGroup } from "@/components/formInput/LectureGroup";
import { useForm, useFieldArray } from "react-hook-form";
import type { FormData } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { formInputSchema } from "@/utils/schemas";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FormDetail = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<FormDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { register, control, watch, setValue, reset, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formInputSchema),
    defaultValues: {
      form: {
        program: "REGULAR_PROGRAM",
        section: "LECTURE",
        month: "มกราคม",
        semester: "ภาคต้น",
        year: new Date().getFullYear() + 543,
        subjectId: "",
        subjectName: "",
      },
      formScheduleDetails: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formScheduleDetails",
  });

  // Handle form submission
  const onSubmit = async (formData: FormData) => {
    if (!formId) return;

    try {
      setIsSaving(true);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("ไม่สามารถดำเนินการได้", {
          description: "กรุณาเข้าสู่ระบบ",
        });
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      console.log("Sending data to API:", JSON.stringify(formData, null, 2));

      const response = await fetch(
        `http://localhost:3000/api/forms/edit-form/${formId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        
        if (response.status === 401) {
          toast.error("เซสชั่นหมดอายุ", {
            description: "กรุณาเข้าสู่ระบบใหม่",
          });
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        throw new Error(errorData.message || `ไม่สามารถอัปเดตแบบฟอร์มได้: ${response.status}`);
      }

      const result = await response.json();
      console.log("Update success:", result);
      toast.success("บันทึกการแก้ไขสำเร็จ!", {
        description: "กำลังนำคุณกลับไปหน้ารายละเอียด",
      });
      setTimeout(() => navigate(`/admin/form/${formId}`), 1500);
    } catch (error: any) {
      console.error("Update form error:", error);
      toast.error("ไม่สามารถบันทึกการแก้ไขได้", {
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
    toast.warning("ข้อมูลไม่ครบถ้วน", {
      description: "กรุณากรอกข้อมูลให้ครบถ้วน",
    });
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    navigate(`/admin/form/${formId}`);
  };

  useEffect(() => {
    if (!formId) {
      setErr("No form ID provided");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const response = await getFormDetail(formId);
        const form = response.data;
        setData(form);

        // Transform data for form display
        const transformedData: FormData = {
          form: {
            program: form.program as any,
            section: form.section as any,
            month: form.month as any,
            semester: form.semester as any,
            year: form.year,
            subjectId: form.subjectId,
            subjectName: form.subjectName,
          },
          formScheduleDetails: form.formScheduleDetails.map((section) => ({
            lectureId: section.sectionId,
            kind: section.kind as "LECTURE" | "LAB",
            schedules: section.schedules.map((schedule) => ({
              date: new Date(schedule.date).toISOString().split("T")[0],
              time: schedule.time,
              totalHour: schedule.totalHour,
              topic: schedule.topic,
              room: schedule.room,
              note: schedule.note,
            })),
            compensation: section.compensation?.map((comp) => ({
              originalDate: new Date(comp.originalDate).toISOString().split("T")[0],
              originalTime: comp.originalTime,
              newDate: new Date(comp.newDate).toISOString().split("T")[0],
              newTime: comp.newTime,
              reason: comp.reason,
            })) || [],
          })),
        };

        reset(transformedData);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to fetch form detail");
      } finally {
        setLoading(false);
      }
    })();
  }, [formId, reset]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl">กำลังโหลดข้อมูลแบบฟอร์ม...</div>
      </div>
    );
  }

  if (err) return <div className="p-4 text-red-600">Error: {err}</div>;
  if (!data) return <div className="p-4">No data</div>;

  // Get title based on section and program
  const getSectionText = (section: string) => {
    return section === "LECTURE" ? "บรรยาย" : "ปฏิบัติการ";
  };

  const getProgramText = (program: string) => {
    return program === "REGULAR_PROGRAM" ? "ภาคปกติ" : "ภาคพิเศษ";
  };

  const sectionThai = getSectionText(data.section);
  const programThai = getProgramText(data.program);
  const teacherName = `${data.user.firstName} ${data.user.lastName}`;

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <header>
        <div className="flex items-center gap-4 bg-[#02BC77] p-4 pl-10 text-3xl font-bold text-white shadow-md">
          <img src={documentsImg} alt="Documents" className="h-28 w-20" />
          <div className="flex flex-col">
            <h1>
              ฟอร์มการสอน{sectionThai} {programThai}
            </h1>
            <p className="text-lg font-bold text-white">
              อาจารย์: {teacherName}
            </p>
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-start">
        <div className="mt-4 w-10/12">
          <div className="flex items-center justify-between">
            <h2 className="mt-4 text-2xl font-bold">ข้อมูลแบบรายงาน</h2>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="month">แบบรายงานการสอนประจำเดือน</Label>
              <Select value={watch("form.month")}>
                <SelectTrigger className="mt-1 w-full bg-white shadow-md" id="month">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-0">
                  <SelectItem value="มกราคม">มกราคม</SelectItem>
                  <SelectItem value="กุมภาพันธ์">กุมภาพันธ์</SelectItem>
                  <SelectItem value="มีนาคม">มีนาคม</SelectItem>
                  <SelectItem value="เมษายน">เมษายน</SelectItem>
                  <SelectItem value="พฤษภาคม">พฤษภาคม</SelectItem>
                  <SelectItem value="มิถุนายน">มิถุนายน</SelectItem>
                  <SelectItem value="กรกฎาคม">กรกฎาคม</SelectItem>
                  <SelectItem value="สิงหาคม">สิงหาคม</SelectItem>
                  <SelectItem value="กันยายน">กันยายน</SelectItem>
                  <SelectItem value="ตุลาคม">ตุลาคม</SelectItem>
                  <SelectItem value="พฤศจิกายน">พฤศจิกายน</SelectItem>
                  <SelectItem value="ธันวาคม">ธันวาคม</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="semester">ภาคการศึกษา</Label>
              <Select value={watch("form.semester")}>
                <SelectTrigger className="mt-1 w-full bg-white shadow-md" id="semester">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-0">
                  <SelectItem value="ภาคต้น">ภาคต้น</SelectItem>
                  <SelectItem value="ภาคปลาย">ภาคปลาย</SelectItem>
                  <SelectItem value="ภาคฤดูร้อน">ภาคฤดูร้อน</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="year">ปีการศึกษา</Label>
              <Input
                id="year"
                type="number"
                className="mt-1 bg-white shadow-md"
                {...register("form.year", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="subjectId">รหัสรายวิชา</Label>
              <Input
                id="subjectId"
                className="mt-1 bg-white shadow-md"
                {...register("form.subjectId")}
              />
            </div>

            <div>
              <Label htmlFor="subjectName">วิชา</Label>
              <Input
                id="subjectName"
                className="mt-1 bg-white shadow-md"
                {...register("form.subjectName")}
              />
            </div>
          </div>

          {fields.map((item, index) => (
            <LectureGroup
              key={item.id}
              control={control}
              index={index}
              register={register}
              removeLectureGroup={() => remove(index)}
              watch={watch}
              setValue={setValue}
              totalGroups={fields.length}
              errors={errors}
            />
          ))}

          <Button
            type="button"
            className="mt-4 h-15 w-full border-0 bg-[#F4F4F5] text-xl font-bold text-[#34C759]"
            onClick={() =>
              append({
                lectureId: "",
                kind: "LECTURE" as const,
                schedules: [
                  {
                    date: "",
                    time: "",
                    totalHour: 1,
                    topic: "",
                    room: "",
                    note: null,
                  },
                ],
              })
            }
          >
            เพิ่มหมู่เรียน
          </Button>

          <div className="mt-8 mb-8 flex justify-end gap-4">
            <Button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 px-8 py-2 text-white hover:bg-red-700"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-green-600 px-8 py-2 text-white hover:bg-green-700"
            >
              {isSaving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </Button>
          </div>
        </div>
      </main>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-yellow-600">ยืนยันการยกเลิก</DialogTitle>
            <DialogDescription className="text-gray-600">
              คุณต้องการยกเลิกการแก้ไข? การเปลี่ยนแปลงจะไม่ถูกบันทึก
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              ไม่ยกเลิก
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmCancel}
            >
              ยืนยันยกเลิก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default FormDetail;
