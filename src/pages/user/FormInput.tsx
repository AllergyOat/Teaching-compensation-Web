import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldArray, useForm } from "react-hook-form";
import { useSearchParams, useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getFormDetail } from "@/api/forms/detail";
import { LectureGroup } from "@/components/formInput/LectureGroup";
import type {
  FormData,
  MonthType,
  SemesterType,
  ProgramType,
  SectionType,
} from "@/utils/types";
import { Button } from "@/components/ui/button";
import documentsImg from "@/assets/images/documents.png";
import {
  thaiMonths,
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
import { toast } from "sonner";
import { getSemesterTracking } from "@/api/forms/semesterTracking";
import SubjectAutocompleteInput from "@/components/formInput/SubjectAutocompleteInput";

const FormInput = () => {
  const [searchParams] = useSearchParams();
  const { id: formId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!!formId);
  
  // State สำหรับ autocomplete
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);

  const program = searchParams.get("program") || "";
  const section = searchParams.get("section") || "";
  const programThai = translateProgram(program);
  const sectionThai = translateSection(section);

  const [trackingData, setTrackingData] = useState<any[]>([]);
  // console.log(trackingData);

  const currentMonthThai = thaiMonths[new Date().getMonth()] as MonthType;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formInputSchema),
    defaultValues: {
      form: {
        program: (program as ProgramType) || "REGULAR_PROGRAM",
        section: (section as SectionType) || "LECTURE",
        month: currentMonthThai,
        semester: "ภาคต้น" as const,
        year: new Date().getFullYear() + 543, // Buddhist year
        subjectId: "",
        subjectName: "",
      },
      formScheduleDetails: [
        {
          lectureId: "",
          kind: "LECTURE" as const,
          totalHours: 0,
          schedules: [
            {
              date: "",
              time: "",
              totalHour: 0,
              topic: "",
              room: "",
              note: null,
            },
          ],
          compensation: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formScheduleDetails",
  });

  useEffect(() => {
    fetchTrackingData();
  }, [
    watch("form.semester"),
    watch("form.year"),
    watch("form.program"),
    watch("form.section"),
  ]);

  // console.log(trackingData)

  const fetchTrackingData = async () => {
    const semester = watch("form.semester");
    const year = watch("form.year");
    const program = watch("form.program");
    const section = watch("form.section");
    if (!semester || !year) return;

    try {
      const res = await getSemesterTracking(semester, year, program, section);
      const tracking = res.data || [];
      setTrackingData(tracking);
    } catch (error) {
      setTrackingData([]);
      console.error("Error fetching semester tracking data:", error);
    }
  };

  function handleSubjectSelect(
    subjectId: string,
    trackingData: any[],
    setValue: any,
  ) {
    const found = trackingData.find(
      (item) => String(item.subjectId).trim() === subjectId,
    );
    if (found) {
      setValue("form.subjectId", subjectId);
      setValue("form.subjectName", found.subjectName);

      if (found.sections && found.sections.length > 0) {
        setValue(
          "formScheduleDetails",
          found.sections.map((section: any) => ({
            lectureId: section.sectionId,
            kind: section.kind,
            totalHours: section.hoursRemaining,
            schedules: [
              {
                date: "",
                time: "",
                totalHour: 0,
                topic: "",
                room: "",
                note: null,
              },
            ],
            compensation: [],
          })),
        );
      }
    } else {
      setValue("form.subjectId", subjectId);
      setValue("form.subjectName", "");
      setValue("formScheduleDetails", [
        {
          lectureId: "",
          kind: "LECTURE",
          totalHours: 0,
          schedules: [
            {
              date: "",
              time: "",
              totalHour: 0,
              topic: "",
              room: "",
              note: null,
            },
          ],
          compensation: [],
        },
      ]);
    }
  }

  // console.log("Tracking Data:", trackingData);

  // Fetch form data for editing
  useEffect(() => {
    const fetchFormData = async () => {
      if (!formId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getFormDetail(formId);

        // Transform the form data to match FormInput format
        const form = response.data;
        console.log("Fetched form data:", form);
        const transformedData: FormData = {
          form: {
            program: form.program as ProgramType,
            section: form.section as SectionType,
            month: form.month as MonthType,
            semester: form.semester as SemesterType,
            year: form.year,
            subjectId: form.subjectId,
            subjectName: form.subjectName,
          },
          formScheduleDetails: form.formScheduleDetails.map((section) => ({
            lectureId: section.sectionId,
            kind: section.kind as "LECTURE" | "LAB",
            totalHours: section.totalHours,
            schedules: section.schedules.map((schedule) => ({
              date: new Date(schedule.date).toISOString().split("T")[0], // Convert to YYYY-MM-DD
              time: schedule.time,
              totalHour: schedule.totalHour,
              topic: schedule.topic,
              room: schedule.room,
              note: schedule.note,
            })),
            compensation:
              section.compensation?.map((comp) => ({
                originalDate: new Date(comp.originalDate)
                  .toISOString()
                  .split("T")[0],
                originalTime: comp.originalTime,
                newDate: new Date(comp.newDate).toISOString().split("T")[0],
                newTime: comp.newTime,
                reason: comp.reason,
              })) || [],
          })),
        };

        // Reset form with the fetched data
        reset(transformedData);
      } catch (error: any) {
        console.error("Error fetching form data:", error);
        if (error.message.includes("login")) {
          navigate("/login");
        } else {
          toast.error("เกิดข้อผิดพลาด", {
            description: "โหลดข้อมูลไม่สำเร็จ",
          });
          setTimeout(() => navigate("/home"), 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, [formId, reset, navigate]);

  // ปิด autocomplete เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#subjectId") && !target.closest(".autocomplete-dropdown")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function สำหรับค้นหารหัสวิชา
  const handleSubjectSearch = (value: string) => {
    setValue("form.subjectId", value);

    if (value.length > 0) {
      const filtered = subjectIds.filter(
        (subject) =>
          subject.code.startsWith(value) ||
          subject.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSubjects(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSubjects([]);
      setShowSuggestions(false);
    }
  };

  // Function เมื่อเลือกรหัสวิชา
  const handleSelectSubject = (subject: Subject) => {
    setValue("form.subjectId", subject.code);
    setValue("form.subjectName", subject.name);
    setShowSuggestions(false);
  };

  const onSubmit = async (data: FormData) => {
    console.log("Form data:", JSON.stringify(data, null, 2));

    const isEdit = !!formId;

    // Show processing toast
    toast.info(isEdit ? "กำลังอัปเดตแบบฟอร์ม" : "กำลังส่งแบบฟอร์ม", {
      description: "กำลังดำเนินการ...",
    });

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("ไม่สามารถดำเนินการได้", {
          description: "กรุณาเข้าสู่ระบบ",
        });
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const url = isEdit
        ? `http://localhost:3000/api/forms/edit-form/${formId}`
        : "http://localhost:3000/api/forms/create-form";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("เซสชั่นหมดอายุ", {
            description: "กรุณาเข้าสู่ระบบใหม่",
          });
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        if (response.status === 403) {
          toast.error("ไม่มีสิทธิ์เข้าถึง", {
            description: "คุณไม่มีสิทธิ์",
          });
          return;
        }
        throw new Error(
          isEdit
            ? "เกิดข้อผิดพลาดในการอัปเดตแบบฟอร์ม"
            : "เกิดข้อผิดพลาดในการส่งแบบฟอร์ม",
        );
      }

      toast.success("สำเร็จ!", {
        description: isEdit ? "อัปเดตแล้ว" : "ส่งแบบฟอร์มแล้ว",
      });

      // Navigate after toast
      setTimeout(() => {
        if (isEdit) {
          navigate(`/home/${formId}`);
        } else {
          navigate("/home");
        }
      }, 1500);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด", {
        description: isEdit ? "อัปเดตไม่สำเร็จ" : "ส่งไม่สำเร็จ",
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl">กำลังโหลดข้อมูลแบบฟอร์ม...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <header>
        <div className="flex items-center gap-4 bg-[#02BC77] p-4 pl-10 text-3xl font-bold text-white shadow-md">
          <img src={documentsImg} alt="Documents" className="h-28 w-20" />
          <h1>
            {formId ? "แก้ไข" : "แบบฟอร์ม"}การสอน{sectionThai} {programThai}
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

            <div className="relative">
              <Label htmlFor="subjectId">รหัสรายวิชา</Label>
              <SubjectAutocompleteInput
                value={watch("form.subjectId")}
                subjects={trackingData}
                onChange={(subjectId) => {
                  handleSubjectSelect(subjectId, trackingData, setValue);
                }}
                error={errors.form?.subjectId?.message}
                placeholder="เช่น 02739200"
              />

              {/* <Input
                id="subjectId"
                className="mt-1 bg-white shadow-md"
                placeholder="เช่น 02739200"
                {...register("form.subjectId")}
                onBlur={handleSubjectIdBlur}
              />
              {errors.form?.subjectId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.form.subjectId.message}
                </p>
              )} */}
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
            {/* Section Buttons to scroll*/}
            {fields.length > 1 && (
              <div>
                <Label>หมู่เรียน</Label>
                {fields.map((item, idx) => (
                  <Button
                    key={item.id}
                    type="button"
                    className="m-2 bg-white text-black shadow-md hover:bg-gray-200"
                    onClick={() => {
                      if (idx === fields.length - 1) {
                        // ถ้าเป็นหมู่สุดท้าย ให้ scroll ไปล่างสุด
                        window.scrollTo({
                          top: document.body.scrollHeight,
                          behavior: "smooth",
                        });
                      } else {
                        // หมู่อื่น scroll แบบเดิม
                        const el = document.getElementById(
                          `section-${item.lectureId}`,
                        );
                        if (el) {
                          const y =
                            el.getBoundingClientRect().top +
                            window.pageYOffset -
                            120; // ปรับ offset ตาม header
                          window.scrollTo({ top: y, behavior: "smooth" });
                        }
                      }
                    }}
                  >
                    {item.lectureId || `Section ${idx + 1}`}
                  </Button>
                ))}
              </div>
            )}
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
              errors={errors.formScheduleDetails?.[index]}
              isFromTracking={
                !formId &&
                !!trackingData.find(
                  (item) =>
                    String(item.subjectId).trim() ===
                    watch("form.subjectId").trim(),
                )
              }
              sectionId={item.lectureId}
            />
          ))}

          {errors.formScheduleDetails && (
            <p className="mt-2 text-sm text-red-500">
              {errors.formScheduleDetails.message}
            </p>
          )}
          {!trackingData.find(
            (item) =>
              String(item.subjectId).trim() === watch("form.subjectId").trim(),
          ) && (
            <Button
              type="button"
              className="mt-4 h-15 w-full border-0 bg-[#F4F4F5] text-xl font-bold text-[#34C759] hover:bg-[#E5E5EA] hover:text-green-800"
              onClick={() =>
                append({
                  lectureId: "",
                  kind: "LECTURE" as const,
                  totalHours: 0,
                  schedules: [
                    {
                      date: "",
                      time: "",
                      totalHour: 0,
                      topic: "",
                      room: "",
                      note: null,
                    },
                  ],
                  compensation: [],
                })
              }
            >
              เพิ่มหมู่เรียน
            </Button>
          )}

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
