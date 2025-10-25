import { useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, ChevronDownIcon, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useSearchParams } from "react-router";
import type {
  Control,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";

// Function to calculate total hours from time range
const calculateTotalHours = (timeRange: string): number => {
  if (!timeRange || !timeRange.includes("-")) {
    return 0;
  }

  const [startTime, endTime] = timeRange.split("-").map((t) => t.trim());

  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

  try {
    const start = parseTime(startTime);
    const end = parseTime(endTime);

    // Handle cases where end time is on the next day (e.g., 23:00-01:00)
    if (end < start) {
      return 24 - start + end;
    }

    return Math.max(0, end - start);
  } catch (error) {
    return 0;
  }
};

interface LectureGroupProps {
  control: Control<any>;
  index: number;
  register: UseFormRegister<any>;
  removeLectureGroup: (index: number) => void;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  totalGroups: number;
  errors?: any;
}

// This is the component for a single lecture group and its schedules
export const LectureGroup = ({
  control,
  index,
  register,
  removeLectureGroup,
  watch,
  setValue,
  totalGroups,
  errors,
}: LectureGroupProps) => {
  // This is a NESTED field array for the schedules within this group
  const { fields, append, remove } = useFieldArray({
    control,
    name: `formScheduleDetails[${index}].schedules`,
  });

  // Field array for compensation
  const {
    fields: compensationFields,
    append: appendCompensation,
    remove: removeCompensation,
  } = useFieldArray({
    control,
    name: `formScheduleDetails[${index}].compensation`,
  });

  // State for managing date pickers (each row has its own state)
  const [datePickerStates, setDatePickerStates] = useState<{
    [key: string]: boolean;
  }>({});

  // State for showing/hiding compensation form
  const [showCompensation, setShowCompensation] = useState(false);

  const [searchParams] = useSearchParams();
  const urlSection = searchParams.get("section") || "";

  // Get section from form data (for edit mode) or URL params (for create mode)
  const formSection = watch("form.section");
  const section = formSection || urlSection;

  // Effect to show compensation section if there's existing compensation data
  useEffect(() => {
    if (compensationFields.length > 0) {
      setShowCompensation(true);
    }
  }, [compensationFields.length]);

  // Effect to calculate totalHour for existing time values
  useEffect(() => {
    fields.forEach((_, k) => {
      const timeValue = watch(
        `formScheduleDetails[${index}].schedules[${k}].time`,
      );
      const currentTotalHour = watch(
        `formScheduleDetails[${index}].schedules[${k}].totalHour`,
      );

      if (timeValue && (!currentTotalHour || currentTotalHour === 0)) {
        const calculatedHours = calculateTotalHours(timeValue);
        if (calculatedHours > 0) {
          setValue(
            `formScheduleDetails[${index}].schedules[${k}].totalHour`,
            calculatedHours,
            { shouldValidate: false, shouldDirty: false },
          );
        }
      }
    });
  }, [fields, index, setValue, watch]);

  // Check if at least one schedule has a note (required for compensation)
  const hasAtLeastOneNote = fields.some((_, k) => {
    const note = watch(`formScheduleDetails[${index}].schedules[${k}].note`);
    return note && note.trim().length > 0;
  });

  return (
    <div className="lecture-group mt-9">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ตารางสอน {index + 1}</h2>
        <div className="flex items-center gap-2">
          {totalGroups > 1 && (
            <Button
              type="button"
              className="text-red-600 hover:text-red-700"
              variant="outline"
              onClick={() => removeLectureGroup(index)}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              ลบหมู่เรียน
            </Button>
          )}
          <Button
            type="button"
            variant={"outline"}
            className="text-blue-600"
            disabled={!hasAtLeastOneNote && !showCompensation}
            onClick={() => {
              if (!showCompensation && compensationFields.length === 0) {
                appendCompensation({
                  originalDate: "",
                  originalTime: "",
                  newDate: "",
                  newTime: "",
                  reason: "",
                });
              }
              setShowCompensation(!showCompensation);
            }}
          >
            <span className="mr-1">
              {showCompensation ? <Minus /> : <Plus />}
            </span>
            {showCompensation ? "ซ่อนบันทึกความ" : "เพิ่มบันทึกความ"}
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="my-4 flex items-center gap-2">
          <Label htmlFor={`formScheduleDetails[${index}].lectureId`}>
            หมู่เรียน
          </Label>
          <div className="flex flex-col">
            <Input
              className="w-32 border-0 border-gray-400 bg-white shadow-md"
              placeholder="กรอกเลขหมู่เรียน"
              {...register(`formScheduleDetails[${index}].lectureId`)}
            />
            {errors?.lectureId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lectureId.message}
              </p>
            )}
          </div>
        </div>

        {section === "LAB" && (
          <div className="my-4 gap-4">
            <Select
              onValueChange={(value) =>
                setValue(`formScheduleDetails[${index}].kind`, value)
              }
              value={watch(`formScheduleDetails[${index}].kind`)}
            >
              <SelectTrigger
                className="mt-1 w-full bg-white shadow-md"
                id="month"
              >
                <SelectValue placeholder="เลือกหมู่" />
              </SelectTrigger>
              <SelectContent className="border-0">
                <SelectGroup>
                  <SelectLabel>เลือกหมู่</SelectLabel>
                  <SelectItem value="LECTURE">บรรยาย</SelectItem>
                  <SelectItem value="LAB">ปฏิบัติ</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ลำดับ</TableHead>
              <TableHead>วัน/เดือน/ปี</TableHead>
              <TableHead>เวลา</TableHead>
              <TableHead>จำนวนชม.</TableHead>
              <TableHead>หัวข้อ</TableHead>
              <TableHead>ห้องเรียน</TableHead>
              <TableHead>หมายเหตุ</TableHead>
              <TableHead>จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((item, k) => (
              <TableRow
                key={item.id}
                className="schedule-item border-0 bg-[#F0F9F6]"
              >
                <TableCell className="text-center">{k + 1}</TableCell>
                <TableCell>
                  {(() => {
                    const dateKey = `${index}-${k}`;
                    const isOpen = datePickerStates[dateKey] || false;
                    const currentDate = watch
                      ? watch(
                          `formScheduleDetails[${index}].schedules[${k}].date`,
                        )
                      : "";

                    return (
                      <Popover
                        open={isOpen}
                        onOpenChange={(open) =>
                          setDatePickerStates((prev) => ({
                            ...prev,
                            [dateKey]: open,
                          }))
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-35 justify-between border-0 bg-white font-normal"
                          >
                            {currentDate
                              ? (() => {
                                  try {
                                    return new Date(
                                      currentDate,
                                    ).toLocaleDateString("th-TH", {
                                      day: "numeric",
                                      month: "numeric",
                                      year: "numeric",
                                    });
                                  } catch (e) {
                                    return currentDate; // Show raw value if date parsing fails
                                  }
                                })()
                              : "เลือกวันที่"}
                            <ChevronDownIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={
                              currentDate ? new Date(currentDate) : undefined
                            }
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              if (date && setValue) {
                                const formattedDate = format(
                                  date,
                                  "yyyy-MM-dd",
                                );
                                setValue(
                                  `formScheduleDetails[${index}].schedules[${k}].date`,
                                  formattedDate,
                                  { shouldValidate: true, shouldDirty: true },
                                );
                              }
                              setDatePickerStates((prev) => ({
                                ...prev,
                                [dateKey]: false,
                              }));
                            }}
                            locale={th}
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="13:00-16:00"
                    className="bg-white"
                    {...register(
                      `formScheduleDetails[${index}].schedules[${k}].time`,
                    )}
                    onChange={(e) => {
                      const timeValue = e.target.value;
                      // Calculate and set total hours
                      const totalHours = calculateTotalHours(timeValue);
                      setValue(
                        `formScheduleDetails[${index}].schedules[${k}].totalHour`,
                        totalHours,
                        { shouldValidate: true, shouldDirty: true },
                      );

                      // Also trigger the original onChange from register
                      const originalOnChange = register(
                        `formScheduleDetails[${index}].schedules[${k}].time`,
                      ).onChange;
                      if (originalOnChange) {
                        originalOnChange(e);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    readOnly
                    className="w-15 bg-gray-50 text-center"
                    min={0}
                    step={0.5}
                    value={
                      watch(
                        `formScheduleDetails[${index}].schedules[${k}].totalHour`,
                      ) || 0
                    }
                    {...register(
                      `formScheduleDetails[${index}].schedules[${k}].totalHour`,
                      { valueAsNumber: true },
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="หัวข้อการสอน"
                    className="bg-white"
                    {...register(
                      `formScheduleDetails[${index}].schedules[${k}].topic`,
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="ห้องเรียน"
                    className="w-20 bg-white"
                    {...register(
                      `formScheduleDetails[${index}].schedules[${k}].room`,
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="หมายเหตุ"
                    className="bg-white"
                    {...register(
                      `formScheduleDetails[${index}].schedules[${k}].note`,
                    )}
                  />
                </TableCell>
                {fields.length > 1 && (
                  <TableCell>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => remove(k)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button
        type="button"
        variant="outline"
        className="mt-2 w-full border-0 font-bold text-[#34B1BD] hover:bg-[#E0F7FA]"
        onClick={() =>
          append({
            date: "",
            time: "",
            topic: "",
            totalHour: 0,
            room: "",
            note: null,
          })
        }
      >
        เพิ่มแถว
      </Button>

      {/* Display validation errors */}
      {errors && (
        <div className="mt-2 space-y-1">
          {errors.kind && (
            <p className="text-sm text-red-500">
              ประเภท: {errors.kind.message}
            </p>
          )}
          {errors.schedules && Array.isArray(errors.schedules) && (
            <div className="space-y-1">
              {errors.schedules.map(
                (scheduleError: any, scheduleIndex: number) => (
                  <div key={scheduleIndex}>
                    {scheduleError && (
                      <p className="text-sm text-red-500">
                        แถวที่ {scheduleIndex + 1}: กรุณากรอกข้อมูล
                        {scheduleError.date && ` ${scheduleError.date.message}`}
                        {scheduleError.time && ` ${scheduleError.time.message}`}
                        {scheduleError.topic &&
                          ` ${scheduleError.topic.message}`}
                        {scheduleError.room && ` ${scheduleError.room.message}`}
                        {scheduleError.totalHour &&
                          ` ${scheduleError.totalHour.message}`}
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>
          )}
          {errors.message && (
            <p className="text-sm text-red-500">{errors.message}</p>
          )}
        </div>
      )}

      {/* Compensation Form Section */}
      {showCompensation && (
        <div className="mt-6 rounded-lg border-1 border-orange-300 bg-orange-50 p-4">
          <h3 className="mb-4 text-xl font-bold text-orange-700">
            บันทึกความชดเชย (ตารางสอนที่ {index + 1})
          </h3>

          <Table>
            <TableHeader>
              <TableRow className="bg-orange-100">
                <TableHead className="text-center">ลำดับ</TableHead>
                <TableHead>วันที่เดิม</TableHead>
                <TableHead>เวลาเดิม</TableHead>
                <TableHead>วันที่ใหม่</TableHead>
                <TableHead>เวลาใหม่</TableHead>
                <TableHead className="text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compensationFields.map((item, k) => (
                <TableRow key={item.id} className="bg-white">
                  <TableCell className="text-center">{k + 1}</TableCell>

                  {/* Original Date */}
                  <TableCell>
                    {(() => {
                      const dateKey = `comp-orig-${index}-${k}`;
                      const isOpen = datePickerStates[dateKey] || false;
                      const currentDate = watch(
                        `formScheduleDetails[${index}].compensation[${k}].originalDate`,
                      );

                      return (
                        <Popover
                          open={isOpen}
                          onOpenChange={(open) =>
                            setDatePickerStates((prev) => ({
                              ...prev,
                              [dateKey]: open,
                            }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-35 justify-between border-0 bg-gray-100 font-normal"
                            >
                              {currentDate
                                ? new Date(currentDate).toLocaleDateString(
                                    "th-TH",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )
                                : "เลือกวันที่"}
                              <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                currentDate ? new Date(currentDate) : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  const isoDate = format(date, "yyyy-MM-dd");
                                  setValue(
                                    `formScheduleDetails[${index}].compensation[${k}].originalDate`,
                                    isoDate,
                                  );
                                  setDatePickerStates((prev) => ({
                                    ...prev,
                                    [dateKey]: false,
                                  }));
                                }
                              }}
                              locale={th}
                            />
                          </PopoverContent>
                        </Popover>
                      );
                    })()}
                    {errors?.compensation && errors.compensation[k] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.compensation[k].originalDate?.message}
                      </p>
                    )}
                  </TableCell>

                  {/* Original Time */}
                  <TableCell>
                    <Input
                      placeholder="08:00-10:00"
                      className="w-32 bg-gray-100"
                      {...register(
                        `formScheduleDetails[${index}].compensation[${k}].originalTime`,
                      )}
                    />
                    {errors?.compensation && errors.compensation[k] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.compensation[k].originalTime?.message}
                      </p>
                    )}
                  </TableCell>

                  {/* New Date */}
                  <TableCell>
                    {(() => {
                      const dateKey = `comp-new-${index}-${k}`;
                      const isOpen = datePickerStates[dateKey] || false;
                      const currentDate = watch(
                        `formScheduleDetails[${index}].compensation[${k}].newDate`,
                      );

                      return (
                        <Popover
                          open={isOpen}
                          onOpenChange={(open) =>
                            setDatePickerStates((prev) => ({
                              ...prev,
                              [dateKey]: open,
                            }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-35 justify-between border-0 bg-gray-100 font-normal"
                            >
                              {currentDate
                                ? new Date(currentDate).toLocaleDateString(
                                    "th-TH",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )
                                : "เลือกวันที่"}
                              <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                currentDate ? new Date(currentDate) : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  const isoDate = format(date, "yyyy-MM-dd");
                                  setValue(
                                    `formScheduleDetails[${index}].compensation[${k}].newDate`,
                                    isoDate,
                                  );
                                  setDatePickerStates((prev) => ({
                                    ...prev,
                                    [dateKey]: false,
                                  }));
                                }
                              }}
                              locale={th}
                            />
                          </PopoverContent>
                        </Popover>
                      );
                    })()}
                    {errors?.compensation && errors.compensation[k] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.compensation[k].newDate?.message}
                      </p>
                    )}
                  </TableCell>

                  {/* New Time */}
                  <TableCell>
                    <Input
                      placeholder="10:00-12:00"
                      className="w-32 bg-gray-100"
                      {...register(
                        `formScheduleDetails[${index}].compensation[${k}].newTime`,
                      )}
                    />
                    {errors?.compensation && errors.compensation[k] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.compensation[k].newTime?.message}
                      </p>
                    )}
                  </TableCell>

                  {/* Delete Button */}
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      disabled={compensationFields.length <= 1}
                      onClick={() => removeCompensation(k)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            type="button"
            variant="outline"
            className="mt-2 w-full border-0 font-bold text-orange-600 hover:bg-orange-100"
            onClick={() =>
              appendCompensation({
                originalDate: "",
                originalTime: "",
                newDate: "",
                newTime: "",
                reason: "",
              })
            }
          >
            เพิ่มแถวบันทึกความสอนชดเชย
          </Button>

          {/* Reason Textarea - Shared for all compensations */}
          <div className="mt-4">
            <Label
              htmlFor={`formScheduleDetails[${index}].compensation.reason`}
              className="text-sm font-medium text-orange-700"
            >
              ทั้งนี้เนื่องจาก (โปรดระบุเหตุผลในการสอนชดเชย)
            </Label>
            <Textarea
              id={`formScheduleDetails[${index}].compensation.reason`}
              placeholder="กรุณาระบุเหตุผลในการสอนชดเชย..."
              className="mt-2 w-full rounded-md border border-orange-300 bg-white p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
              rows={3}
              value={
                watch(`formScheduleDetails[${index}].compensation[0].reason`) ||
                ""
              }
              onChange={(e) => {
                const newReason = e.target.value;
                // Update reason for all compensation rows
                compensationFields.forEach((_, k) => {
                  setValue(
                    `formScheduleDetails[${index}].compensation[${k}].reason`,
                    newReason,
                  );
                });
              }}
            />
            {errors?.compensation && errors.compensation[0]?.reason && (
              <p className="mt-1 text-sm text-red-600">
                {errors.compensation[0].reason?.message}
              </p>
            )}
          </div>

          
        </div>
      )}
    </div>
  );
};
