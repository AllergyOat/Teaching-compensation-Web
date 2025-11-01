import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldArray, useForm } from "react-hook-form";
import { useSearchParams, useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { 
  createSubjectSectionRate, 
  updateSubjectSectionRate,
  getSubjectSectionRateById 
} from "@/api/admin/subject";

type FormSubjectData = z.infer<typeof formSubjectSchema>;

const FormSubject = () => {
  const [searchParams] = useSearchParams();
  const { id: subjectId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!!subjectId);
  
  // For create mode: use semester from query parameter
  // For edit mode: will be loaded from database
  const semesterFromQuery = searchParams.get("semester") || "ภาคต้น";
  
  // State for program selection
  const [includeRegularProgram, setIncludeRegularProgram] = useState(true);
  const [includeSpecialProgram, setIncludeSpecialProgram] = useState(true);
  
  // State to store program data when unchecked (to restore when checked back)
  const [savedRegularProgram, setSavedRegularProgram] = useState<any>(null);
  const [savedSpecialProgram, setSavedSpecialProgram] = useState<any>(null);
  
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
      semester: semesterFromQuery as SemesterType,
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

  const { fields: programFields, replace: replacePrograms } = useFieldArray({
    control,
    name: "programs",
  });

  // Fetch subject data for editing
  useEffect(() => {
    const fetchSubjectData = async () => {
      if (!subjectId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getSubjectSectionRateById(subjectId);

        if (response.success && response.data && response.data.length > 0) {
          const subjectGroups = response.data;
          
          // Get basic info from first group
          const firstGroup = subjectGroups[0];
          setValue("subjectId", firstGroup.subjectId);
          setValue("subjectName", firstGroup.subjectName);
          setValue("semester", firstGroup.semester);
          setValue("section", firstGroup.section);

          // Check which programs are included
          const hasRegular = subjectGroups.some(g => g.program === "REGULAR_PROGRAM");
          const hasSpecial = subjectGroups.some(g => g.program === "SPECIAL_PROGRAM");
          setIncludeRegularProgram(hasRegular);
          setIncludeSpecialProgram(hasSpecial);

          // Build programs array
          const programs = subjectGroups.map(group => ({
            program: group.program,
            sections: group.sections.map(section => ({
              sectionId: section.sectionId,
              kind: section.kind,
              ratePerHour: section.ratePerHour,
              maxTotalHours: section.MaxTotalHours,
              teacherTotalHours: section.teacherTotalHours,
            })),
          }));

          setValue("programs", programs as any);
        }
      } catch (error: any) {
        console.error("Error fetching subject data:", error);
        toast.error("เกิดข้อผิดพลาด", {
          description: "โหลดข้อมูลไม่สำเร็จ",
        });
        setTimeout(() => navigate("/admin/subject"), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjectData();
  }, [subjectId, setValue, navigate]);

  // Set semester from query parameter (only for create mode - when there's no subjectId)
  useEffect(() => {
    if (!subjectId && semesterFromQuery) {
      setValue("semester", semesterFromQuery as SemesterType);
    }
  }, [semesterFromQuery, setValue, subjectId]);

  // Update programs based on checkbox selection
  useEffect(() => {
    const currentPrograms = watch("programs") || [];
    const newPrograms = [];
    
    if (includeRegularProgram) {
      // Try to restore from saved data or find existing data
      const existingRegular = currentPrograms.find(p => p.program === "REGULAR_PROGRAM");
      const regularData = savedRegularProgram || existingRegular;
      
      if (regularData) {
        newPrograms.push(regularData);
      } else {
        // Create new with default values
        newPrograms.push({
          program: "REGULAR_PROGRAM" as const,
          sections: [
            {
              sectionId: "",
              kind: "LECTURE" as const,
              ratePerHour: 0,
              maxTotalHours: 0,
              teacherTotalHours: null,
            },
          ],
        });
      }
    } else {
      // Save current regular program data before removing
      const existingRegular = currentPrograms.find(p => p.program === "REGULAR_PROGRAM");
      if (existingRegular) {
        setSavedRegularProgram(existingRegular);
      }
    }
    
    if (includeSpecialProgram) {
      // Try to restore from saved data or find existing data
      const existingSpecial = currentPrograms.find(p => p.program === "SPECIAL_PROGRAM");
      const specialData = savedSpecialProgram || existingSpecial;
      
      if (specialData) {
        newPrograms.push(specialData);
      } else {
        // Create new with default values
        newPrograms.push({
          program: "SPECIAL_PROGRAM" as const,
          sections: [
            {
              sectionId: "",
              kind: "LECTURE" as const,
              ratePerHour: 0,
              maxTotalHours: 0,
              teacherTotalHours: null,
            },
          ],
        });
      }
    } else {
      // Save current special program data before removing
      const existingSpecial = currentPrograms.find(p => p.program === "SPECIAL_PROGRAM");
      if (existingSpecial) {
        setSavedSpecialProgram(existingSpecial);
      }
    }
    
    if (newPrograms.length > 0) {
      replacePrograms(newPrograms);
    }
  }, [includeRegularProgram, includeSpecialProgram]);

  const onSubmit = async (data: FormSubjectData) => {
    console.log("Form data:", JSON.stringify(data, null, 2));
    
    const isEdit = !!subjectId;

    // Validate at least one program is selected
    if (!includeRegularProgram && !includeSpecialProgram) {
      toast.error("กรุณาเลือกหลักสูตร", {
        description: "กรุณาเลือกอย่างน้อย 1 หลักสูตร (ภาคปกติ หรือ ภาคพิเศษ)",
      });
      return;
    }
    
    toast.info(isEdit ? "กำลังอัปเดตข้อมูล" : "กำลังบันทึกข้อมูล", {
      description: "กำลังดำเนินการ...",
    });

    try {
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
          teacherTotalHours: section.teacherTotalHours ?? null,
        }))
      );

      const requestData = { sections };
      console.log("Sending to API:", JSON.stringify(requestData, null, 2));

      // Use appropriate API function based on mode
      const result = isEdit
        ? await updateSubjectSectionRate(subjectId, requestData)
        : await createSubjectSectionRate(requestData);
      
      console.log("API Response:", result);
      
      toast.success("สำเร็จ!", {
        description: result.message || (isEdit ? "อัปเดตข้อมูลรายวิชาแล้ว" : "บันทึกข้อมูลรายวิชาแล้ว"),
      });

      // Navigate back after success
      setTimeout(() => {
        navigate("/admin/subject");
      }, 1500);
    } catch (error: any) {
      console.error("Error:", error);
      
      // Handle specific error cases
      if (error?.message) {
        toast.error("เกิดข้อผิดพลาด", {
          description: error.message,
        });
      } else {
        toast.error("เกิดข้อผิดพลาด", {
          description: isEdit ? "อัปเดตข้อมูลไม่สำเร็จ" : "บันทึกข้อมูลไม่สำเร็จ",
        });
      }
    }
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
    toast.warning("ข้อมูลไม่ครบถ้วน", {
      description: "กรุณากรอกข้อมูลให้ครบถ้วน",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl">กำลังโหลดข้อมูลรายวิชา...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <header>
        <div className="flex items-center gap-4 bg-[#02BC77] p-4 pl-10 text-3xl font-bold text-white shadow-md">
          <img src={documentsImg} alt="Documents" className="h-28 w-20" />
          <h1>{subjectId ? "แก้ไข" : "เพิ่ม"}รายวิชาและอัตราค่าสอน</h1>
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
                disabled={!subjectId}
                value={watch("semester")}
                onValueChange={(value) => setValue("semester", value as SemesterType)}
              >
                <SelectTrigger
                  className={`mt-1 w-full shadow-md ${subjectId ? "bg-gray-100" : "bg-white"}`}
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

          {/* Program Selection */}
          <div className="mt-6 rounded-lg border-2 border-gray-200 bg-gray-50 p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">เลือกหลักสูตร</h3>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="regularProgram"
                  checked={includeRegularProgram}
                  onCheckedChange={(checked) => setIncludeRegularProgram(checked as boolean)}
                />
                <Label
                  htmlFor="regularProgram"
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  ภาคปกติ (Regular Program)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="specialProgram"
                  checked={includeSpecialProgram}
                  onCheckedChange={(checked) => setIncludeSpecialProgram(checked as boolean)}
                />
                <Label
                  htmlFor="specialProgram"
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  ภาคพิเศษ (Special Program)
                </Label>
              </div>
            </div>
            {!includeRegularProgram && !includeSpecialProgram && (
              <p className="mt-2 text-sm text-red-500">
                กรุณาเลือกอย่างน้อย 1 หลักสูตร
              </p>
            )}
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
              onClick={() => navigate("/admin/subject")}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="bg-green-600 px-8 py-2 text-white hover:bg-green-700"
            >
              {subjectId ? "อัปเดตข้อมูล" : "บันทึกข้อมูล"}
            </Button>
          </div>
        </div>
      </main>
    </form>
  );
};

export default FormSubject;