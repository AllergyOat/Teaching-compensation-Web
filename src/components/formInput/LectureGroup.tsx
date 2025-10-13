import { useFieldArray } from "react-hook-form";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Trash2, ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

// This is the component for a single lecture group and its schedules
export const LectureGroup = ({
  control,
  index,
  register,
  removeLectureGroup,
  watch,
  setValue,
  totalGroups,
}: any) => {
  // This is a NESTED field array for the schedules within this group
  const { fields, append, remove } = useFieldArray({
    control,
    name: `formScheduleDetails[${index}].schedules`,
  });

  // State for managing date pickers (each row has its own state)
  const [datePickerStates, setDatePickerStates] = useState<{
    [key: string]: boolean;
  }>({});

  return (
    <div className="lecture-group mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ตารางสอน {index + 1} </h2>
        {totalGroups > 1 && (
          <Button
            type="button"
            className="text-red-600 hover:text-red-700"
            variant={"outline"}
            onClick={() => removeLectureGroup(index)}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            ลบหมู่เรียน
          </Button>
        )}
      </div>

      <div className="my-4 flex items-center gap-4">
        <Label htmlFor={`formScheduleDetails[${index}].lectureId`}>
          หมู่เรียน
        </Label>
        <Input
          className="w-32 border-0 border-gray-400 bg-white shadow-md"
          placeholder="กรอกเลขหมู่เรียน"
          {...register(`formScheduleDetails[${index}].lectureId`)}
        />
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
                <TableCell>{k + 1}</TableCell>
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
                    placeholder="13:00 - 16:00"
                    className="bg-white"
                    {...register(
                      `formScheduleDetails[${index}].schedules[${k}].time`,
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    className="w-15 bg-white"
                    {...register(
                      `formScheduleDetails[${index}].schedules[${k}].totalHour`,
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
    </div>
  );
};
