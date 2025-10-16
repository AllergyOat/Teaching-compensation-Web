import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormInfo = {
  month: string;
  semester: string;
  year: number;
  subjectId: string;
  subjectName: string;
};

interface FormInfoSectionProps {
  form: FormInfo;
  updateFormField: <K extends keyof FormInfo>(
    key: K,
    value: FormInfo[K],
  ) => void;
}

export function FormInfoSection({
  form,
  updateFormField,
}: FormInfoSectionProps) {
  return (
    <div>
      <h2 className="mt-4 text-2xl font-bold">ข้อมูลแบบรายงาน</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label htmlFor="month">แบบรายงานการสอนประจำเดือน</Label>
          <Input
            className="bg-white shadow-md"
            id="month"
            value={form.month}
            onChange={(e) => updateFormField("month", e.target.value)}
            placeholder="เช่น ธันวาคม"
          />
        </div>

        <div>
          <Label htmlFor="semester">ภาคการศึกษา</Label>
          <Input
            className="bg-white shadow-md"
            id="semester"
            value={form.semester}
            onChange={(e) => updateFormField("semester", e.target.value)}
            placeholder="เช่น ภาคต้น"
          />
        </div>

        <div>
          <Label htmlFor="year">ปีการศึกษา</Label>
          <Input
            className="bg-white shadow-md"
            id="year"
            type="number"
            value={form.year}
            onChange={(e) =>
              updateFormField("year", parseInt(e.target.value) || 0)
            }
            placeholder="เช่น 2568"
          />
        </div>

        <div>
          <Label htmlFor="subjectId">รหัสรายวิชา</Label>
          <Input
            className="bg-white shadow-md"
            id="subjectId"
            value={form.subjectId}
            onChange={(e) => updateFormField("subjectId", e.target.value)}
            placeholder="เช่น 02739200"
          />
        </div>

        <div>
          <Label htmlFor="subjectName">วิชา</Label>
          <Input
            className="bg-white shadow-md"
            id="subjectName"
            value={form.subjectName}
            onChange={(e) => updateFormField("subjectName", e.target.value)}
            placeholder="เช่น Computer Programming"
          />
        </div>
      </div>
    </div>
  );
}
