import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldArray, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { LectureGroup } from "@/components/formInput/LectureGroup";
import type { FormData } from "@/utils/types";
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

const Test = () => {
  const [searchParams] = useSearchParams();
  const program = searchParams.get("program") || "";
  const section = searchParams.get("section") || "";
  const programThai = translateProgram(program);
  const sectionThai = translateSection(section);
  const { register, control, handleSubmit, watch, setValue } =
    useForm<FormData>({
      defaultValues: {
        form: {
          program: program,
          section: section,
          month: "",
          semester: "",
          year: new Date().getFullYear() + 543, // Buddhist year
          subjectId: "",
          subjectName: "",
        },
        formScheduleDetails: [
          {
            lectureId: "",
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
          },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formScheduleDetails",
  });

  const onSubmit = (data: any) => {
    console.log(JSON.stringify(data, null, 2));
    alert("Check console for submitted data");
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                onValueChange={(value) => setValue("form.month", value)}
                value={watch("form.month")}
              >
                <SelectTrigger className="mt-1 w-full bg-white shadow-md" id="month">
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
            </div>

            <div>
              <Label htmlFor="semester">ภาคการศึกษา</Label>
              <Select
                onValueChange={(value) => setValue("form.semester", value)}
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
            </div>

            <div>
              <Label htmlFor="year">ปีการศึกษา</Label>
              <Input
                id="year"
                type="number"
                min={new Date().getFullYear() + 543}
                max={new Date().getFullYear() + 543 + 10}
                className="mt-1 bg-white shadow-md"
                {...register("form.year")}
              />
            </div>

            <div>
              <Label htmlFor="subjectId">รหัสรายวิชา</Label>
              <Input
                id="subjectId"
                className="mt-1 bg-white shadow-md"
                placeholder="เช่น 02739200"
                {...register("form.subjectId")}
              />
            </div>

            <div>
              <Label htmlFor="subjectName">วิชา</Label>
              <Input
                id="subjectName"
                className="mt-1 bg-white shadow-md"
                placeholder="เช่น Computer Programming"
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
              removeLectureGroup={remove}
              watch={watch}
              setValue={setValue}
              totalGroups={fields.length}
            />
          ))}

          <Button
            type="button"
            className="mt-4 h-15 w-full border-0 bg-[#F4F4F5] text-xl font-bold text-[#34C759]"
            onClick={() =>
              append({
                lectureId: "",
                schedules: [
                  {
                    date: "",
                    time: "",
                    topic: "",
                    totalHour: 0,
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
export default Test;
