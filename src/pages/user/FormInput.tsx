import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldArray, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { LectureGroup } from "@/components/formInput/LectureGroup";
import type { FormData, MonthType, SemesterType } from "@/utils/types";
import { Button } from "@/components/ui/button";
import documentsImg from "@/assets/images/documents.png";
import {
  translateProgram,
  translateSection,
} from "@/utils/programSectionUtils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { formInputSchema } from "@/utils/schemas";

const FormInput = () => {
  const [searchParams] = useSearchParams();
  const program = searchParams.get("program") || "";
  const section = searchParams.get("section") || "";
  const programThai = translateProgram(program);
  const sectionThai = translateSection(section);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formInputSchema),
    defaultValues: {
      form: {
        program: program,
        section: section,
        month: "มกราคม" as const,
        semester: "ภาคต้น" as const,
        year: new Date().getFullYear() + 543, // Buddhist year
        subjectId: "",
        subjectName: "",
      },
      formScheduleDetails: [
        {
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
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formScheduleDetails",
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form data:", JSON.stringify(data, null, 2));
    alert("แบบฟอร์มผ่านการตรวจสอบแล้ว! ตรวจสอบ console สำหรับข้อมูล");
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("กรุณาเข้าสู่ระบบก่อนส่งแบบฟอร์ม");
        return;
      }

      const response = await fetch(
        "http://localhost:3000/api/forms/create-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(FormData),
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          alert("เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          // Optionally redirect to login page
          return;
        }
        throw new Error("เกิดข้อผิดพลาดในการส่งแบบฟอร์ม");
      }

      alert("ส่งแบบฟอร์มสำเร็จ!");
    } catch (error) {
      alert("ไม่สามารถส่งแบบฟอร์มได้");
      console.error(error);
    }
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
    alert("กรุณาตรวจสอบข้อมูลในแบบฟอร์มให้ครบถ้วน");
  };
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <header>
        <div className="flex items-center gap-4 bg-[#02BC77] p-4 pl-10 text-3xl font-bold text-white shadow-md">
          <img src={documentsImg} alt="Documents" className="h-28 w-20" />
          <h1>
            แบบฟอร์มการสอน{sectionThai} {programThai}
          </h1>
        </div>
      </header>
      <main className="flex flex-col items-center justify-start">
        <div className="mt-4 w-10/12">
          <h2 className="mt-4 text-2xl font-bold">ข้อมูลแบบรายงาน</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="month">แบบรายงานการสอนประจำเดือน</Label>
              <Select
                onValueChange={(value) =>
                  setValue("form.month", value as MonthType)
                }
                value={watch("form.month")}
              >
                <SelectTrigger
                  className="mt-1 w-full bg-white shadow-md"
                  id="month"
                >
                  <SelectValue placeholder="เลือกเดือนแบบรายงานการสอน" />
                </SelectTrigger>
                <SelectContent className="border-0">
                  <SelectGroup>
                    <SelectLabel>เลือกเดือน</SelectLabel>
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
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.form?.month && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.form.month.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="semester">ภาคการศึกษา</Label>
              <Select
                onValueChange={(value) =>
                  setValue("form.semester", value as SemesterType)
                }
                value={watch("form.semester")}
              >
                <SelectTrigger
                  className="mt-1 w-full bg-white shadow-md"
                  id="semester"
                >
                  <SelectValue placeholder="เลือกภาคการศึกษา" />
                </SelectTrigger>
                <SelectContent className="border-0">
                  <SelectGroup>
                    <SelectLabel>เลือกภาคการศึกษา</SelectLabel>
                    <SelectItem value="ภาคต้น">ภาคต้น</SelectItem>
                    <SelectItem value="ภาคปลาย">ภาคปลาย</SelectItem>
                    <SelectItem value="ภาคฤดูร้อน">ภาคฤดูร้อน</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.form?.semester && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.form.semester.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="year">ปีการศึกษา</Label>
              <Input
                id="year"
                type="number"
                min={new Date().getFullYear() + 543}
                max={new Date().getFullYear() + 543 + 10}
                className="mt-1 bg-white shadow-md"
                {...register("form.year", { valueAsNumber: true })}
              />
              {errors.form?.year && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.form.year.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="subjectId">รหัสรายวิชา</Label>
              <Input
                id="subjectId"
                className="mt-1 bg-white shadow-md"
                placeholder="เช่น 02739200"
                {...register("form.subjectId")}
              />
              {errors.form?.subjectId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.form.subjectId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="subjectName">วิชา</Label>
              <Input
                id="subjectName"
                className="mt-1 bg-white shadow-md"
                placeholder="เช่น Computer Programming"
                {...register("form.subjectName")}
              />
              {errors.form?.subjectName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.form.subjectName.message}
                </p>
              )}
            </div>
          </div>

          {fields.map((item, index) => (
            <LectureGroup
              key={item.id}
              control={control}
              index={index}
              register={register}
              removeLectureGroup={remove}
              watch={watch}
              setValue={setValue}
              totalGroups={fields.length}
            />
          ))}

          {errors.formScheduleDetails && (
            <p className="mt-2 text-sm text-red-500">
              {errors.formScheduleDetails.message}
            </p>
          )}

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
                    topic: "",
                    totalHour: 1,
                    room: "",
                    note: null,
                  },
                ],
              })
            }
          >
            เพิ่มหมู่เรียน
          </Button>

          <div className="mt-8 mb-8 flex justify-end">
            <Button
              type="submit"
              className="bg-green-600 px-8 py-2 text-white hover:bg-green-700"
            >
              ส่งแบบฟอร์ม
            </Button>
          </div>
        </div>
      </main>
    </form>
  );
};
export default FormInput;
