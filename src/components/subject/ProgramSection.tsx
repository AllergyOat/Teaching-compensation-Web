import { useFieldArray } from 'react-hook-form';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

// Component for each program section (REGULAR/SPECIAL)
const ProgramSection = ({
  programIndex,
  programTitle,
  control,
  register,
  watch,
  setValue,
  errors,
}: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `programs.${programIndex}.sections`,
  });

  const addSection = () => {
    append({
      sectionId: "",
      kind: "LECTURE",
      ratePerHour: 0,
      maxTotalHours: 0,
      teacherTotalHours: null,
    });
  };

  return (
    <div className="mt-8 rounded-lg border-2 border-gray-200 p-6 shadow-sm">
      <h3 className="mb-4 text-xl font-bold text-[#02BC77]">{programTitle}</h3>

      {fields.map((field: any, sectionIndex: number) => (
        <div
          key={field.id}
          className="mb-6 rounded-lg border border-gray-300 bg-gray-50 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-lg font-semibold">
              หมู่เรียนที่ {sectionIndex + 1}
            </h4>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(sectionIndex)}
              >
                ลบหมู่เรียน
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor={`programs.${programIndex}.sections.${sectionIndex}.sectionId`}>
                หมู่เรียน
              </Label>
              <Input
                id={`programs.${programIndex}.sections.${sectionIndex}.sectionId`}
                className="mt-1 bg-white shadow-md"
                placeholder="เช่น 701, 702"
                {...register(
                  `programs.${programIndex}.sections.${sectionIndex}.sectionId`
                )}
              />
              {errors?.programs?.[programIndex]?.sections?.[sectionIndex]?.sectionId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.programs[programIndex].sections[sectionIndex].sectionId.message}
                </p>
              )}
            </div>

            {watch("section") === "LAB" && (
              <div>
                <Label htmlFor={`programs.${programIndex}.sections.${sectionIndex}.kind`}>
                  ประเภทการสอน
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      `programs.${programIndex}.sections.${sectionIndex}.kind`,
                      value as "LECTURE" | "LAB"
                    )
                  }
                  value={watch(`programs.${programIndex}.sections.${sectionIndex}.kind`)}
                >
                  <SelectTrigger
                    className="mt-1 w-full bg-white shadow-md"
                    id={`programs.${programIndex}.sections.${sectionIndex}.kind`}
                  >
                    <SelectValue placeholder="เลือกประเภทการสอน" />
                  </SelectTrigger>
                  <SelectContent className="border-0">
                    <SelectGroup>
                      <SelectLabel>เลือกประเภทการสอน</SelectLabel>
                      <SelectItem value="LECTURE">บรรยาย</SelectItem>
                      <SelectItem value="LAB">ปฏิบัติ</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors?.programs?.[programIndex]?.sections?.[sectionIndex]?.kind && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.programs[programIndex].sections[sectionIndex].kind.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor={`programs.${programIndex}.sections.${sectionIndex}.ratePerHour`}>
                อัตราค่าสอนต่อชั่วโมง (บาท)
              </Label>
              <Input
                id={`programs.${programIndex}.sections.${sectionIndex}.ratePerHour`}
                type="number"
                min={0}
                className="mt-1 bg-white shadow-md"
                placeholder="เช่น 600"
                {...register(
                  `programs.${programIndex}.sections.${sectionIndex}.ratePerHour`,
                  { valueAsNumber: true }
                )}
              />
              {errors?.programs?.[programIndex]?.sections?.[sectionIndex]?.ratePerHour && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.programs[programIndex].sections[sectionIndex].ratePerHour.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={`programs.${programIndex}.sections.${sectionIndex}.maxTotalHours`}>
                จำนวนชั่วโมงสูงสุด
              </Label>
              <Input
                id={`programs.${programIndex}.sections.${sectionIndex}.maxTotalHours`}
                type="number"
                min={0}
                className="mt-1 bg-white shadow-md"
                placeholder="เช่น 30"
                {...register(
                  `programs.${programIndex}.sections.${sectionIndex}.maxTotalHours`,
                  { valueAsNumber: true }
                )}
              />
              {errors?.programs?.[programIndex]?.sections?.[sectionIndex]?.maxTotalHours && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.programs[programIndex].sections[sectionIndex].maxTotalHours.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={`programs.${programIndex}.sections.${sectionIndex}.teacherTotalHours`}>
                จำนวนชั่วโมงที่อาจาร์ยต้องการสอน (ถ้ามี)
              </Label>
              <Input
                id={`programs.${programIndex}.sections.${sectionIndex}.teacherTotalHours`}
                type="number"
                min={0}
                className="mt-1 bg-white shadow-md"
                placeholder="เว้นว่างหากยังไม่มี"
                {...register(
                  `programs.${programIndex}.sections.${sectionIndex}.teacherTotalHours`,
                  { 
                    setValueAs: (v: any) => {
                      if (v === "" || v === null || v === undefined) return null;
                      const num = Number(v);
                      return isNaN(num) ? null : num;
                    }
                  }
                )}
              />
              {errors?.programs?.[programIndex]?.sections?.[sectionIndex]?.teacherTotalHours && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.programs[programIndex].sections[sectionIndex].teacherTotalHours.message}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        className="mt-4 w-full border-0 bg-[#F4F4F5] text-lg font-bold text-[#34C759] hover:bg-[#E5E5EA] hover:text-green-800"
        onClick={addSection}
      >
        + เพิ่มหมู่เรียนใน{programTitle}
      </Button>

      {errors?.programs?.[programIndex]?.sections && (
        <p className="mt-2 text-sm text-red-500">
          {errors.programs[programIndex].sections.message}
        </p>
      )}
    </div>
  );
};

export default ProgramSection