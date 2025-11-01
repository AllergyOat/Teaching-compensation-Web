import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldArray, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import documentsImg from "@/assets/images/documents.png";
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
import { formSubjectSchema } from "@/utils/schemas";
import { toast } from "sonner";
import type { SemesterType } from "@/utils/types";
import { z } from "zod";
import ProgramSection from "@/components/subject/ProgramSection";

type FormSubjectData = z.infer<typeof formSubjectSchema>;

const FormSubject = () => {
  const [searchParams] = useSearchParams();
  const semester = searchParams.get("semester") || "ภาคต้น";
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormSubjectData>({
    resolver: zodResolver(formSubjectSchema) as any,
    defaultValues: {
      subjectId: "",
      subjectName: "",
      semester: "ภาคต้น",
      section: "LECTURE",
      programs: [
        {
          program: "REGULAR_PROGRAM",
          sections: [
            {
              sectionId: "",
              kind: "LECTURE",
              ratePerHour: 0,
              maxTotalHours: 0,
              teacherTotalHours: null,
            },
          ],
        },
        {
          program: "SPECIAL_PROGRAM",
          sections: [
            {
              sectionId: "",
              kind: "LECTURE",
              ratePerHour: 0,
              maxTotalHours: 0,
              teacherTotalHours: null,
            },
          ],
        },
      ],
    },
  });

  const { fields: programFields } = useFieldArray({
    control,
    name: "programs",
  });

  // Set semester from params
  useEffect(() => {
    if (semester) {
      setValue("semester", semester as SemesterType);
    }
  }, [semester, setValue]);

  const onSubmit = async (data: FormSubjectData) => {
    console.log("Form data:", JSON.stringify(data, null, 2));
    
    toast.info("กำลังบันทึกข้อมูล", {
      description: "กำลังดำเนินการ...",
    });

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("ไม่สามารถดำเนินการได้", {
          description: "กรุณาเข้าสู่ระบบ",
        });
        return;
      }

      // Transform data to match API format
      const sections = data.programs.flatMap(program => 
        program.sections.map(section => ({
          subjectId: data.subjectId,
          subjectName: data.subjectName,
          section: data.section,
          sectionId: section.sectionId,
          program: program.program,
          kind: section.kind || data.section,
          semester: data.semester,
          ratePerHour: section.ratePerHour,
          maxTotalHours: section.maxTotalHours,
          teacherTotalHours: section.teacherTotalHours,
        }))
      );

      const requestData = { sections };
      console.log("Sending to API:", JSON.stringify(requestData, null, 2));

      const response = await fetch("http://localhost:3000/api/admin/subject-section-rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("เซสชั่นหมดอายุ", {
            description: "กรุณาเข้าสู่ระบบใหม่",
          });
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          return;
        }
        if (response.status === 403) {
          toast.error("ไม่มีสิทธิ์เข้าถึง", {
            description: "คุณไม่มีสิทธิ์ในการดำเนินการนี้",
          });
          return;
        }
        throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      const result = await response.json();
      console.log("API Response:", result);
      
      toast.success("สำเร็จ!", {
        description: "บันทึกข้อมูลรายวิชาแล้ว",
      });

      // Navigate back or reset form after success
      setTimeout(() => {
        window.history.back();
      }, 1500);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด", {
        description: "บันทึกข้อมูลไม่สำเร็จ",
      });
      console.error(error);
    }
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
    toast.warning("ข้อมูลไม่ครบถ้วน", {
      description: "กรุณากรอกข้อมูลให้ครบถ้วน",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <header>
        <div className="flex items-center gap-4 bg-[#02BC77] p-4 pl-10 text-3xl font-bold text-white shadow-md">
          <img src={documentsImg} alt="Documents" className="h-28 w-20" />
          <h1>เพิ่มรายวิชาและอัตราค่าสอน</h1>
        </div>
      </header>
      <main className="flex flex-col items-center justify-start">
        <div className="mt-4 w-10/12">
          <h2 className="mt-4 text-2xl font-bold">ข้อมูลรายวิชา</h2>
          
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="subjectId">รหัสรายวิชา</Label>
              <Input
                id="subjectId"
                className="mt-1 bg-white shadow-md"
                placeholder="เช่น 02739411"
                {...register("subjectId")}
              />
              {errors.subjectId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.subjectId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="subjectName">ชื่อรายวิชา</Label>
              <Input
                id="subjectName"
                className="mt-1 bg-white shadow-md"
                placeholder="เช่น IT Project"
                {...register("subjectName")}
              />
              {errors.subjectName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.subjectName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="semester">ภาคการศึกษา</Label>
              <Select
                disabled
                value={watch("semester")}
              >
                <SelectTrigger
                  className="mt-1 w-full bg-gray-100 shadow-md"
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
              {errors.semester && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.semester.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="section">ประเภทหมู่เรียน</Label>
              <Select
                onValueChange={(value) =>
                  setValue("section", value as "LECTURE" | "LAB")
                }
                value={watch("section")}
              >
                <SelectTrigger
                  className="mt-1 w-full bg-white shadow-md"
                  id="section"
                >
                  <SelectValue placeholder="เลือกประเภทหมู่เรียน" />
                </SelectTrigger>
                <SelectContent className="border-0">
                  <SelectGroup>
                    <SelectLabel>เลือกประเภทหมู่เรียน</SelectLabel>
                    <SelectItem value="LECTURE">บรรยาย</SelectItem>
                    <SelectItem value="LAB">ปฏิบัติ</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.section && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.section.message}
                </p>
              )}
            </div>
          </div>

          {/* Programs Section */}
          {programFields.map((programField, programIndex) => {
            const programType = watch(`programs.${programIndex}.program`);
            const programTitle = programType === "REGULAR_PROGRAM" ? "ภาคปกติ" : "ภาคพิเศษ";
            
            return (
              <ProgramSection
                key={programField.id}
                programIndex={programIndex}
                programTitle={programTitle}
                control={control}
                register={register}
                watch={watch}
                setValue={setValue}
                errors={errors}
              />
            );
          })}

          <div className="mt-8 mb-8 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="px-8 py-2"
              onClick={() => window.history.back()}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="bg-green-600 px-8 py-2 text-white hover:bg-green-700"
            >
              บันทึกข้อมูล
            </Button>
          </div>
        </div>
      </main>
    </form>
  );
};

export default FormSubject;