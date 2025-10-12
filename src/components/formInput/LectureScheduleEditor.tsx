import * as React from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Plus, Trash2 } from "lucide-react";

export type Schedule = {
  date?: string;
  time: string;
  totalHour: number;
  topic: string;
  room: string;
  note?: string | null;
};

export type LectureGroup = {
  lectureId: string;
  schedules: Schedule[];
};

type Props = {
  value: LectureGroup[];
  onChange: (next: LectureGroup[]) => void;
};

export function LectureScheduleEditor({ value, onChange }: Props) {
  const [openKeys, setOpenKeys] = React.useState<Record<string, boolean>>({});

  const toggleDatePicker = (key: string) =>
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const setValue = (updater: (prev: LectureGroup[]) => LectureGroup[]) => {
    onChange(updater(value));
  };

  const updateLectureId = (lectureIndex: number, lectureId: string) =>
    setValue((prev) => {
      const next = structuredClone(prev);
      next[lectureIndex].lectureId = lectureId;
      return next;
    });

  const updateSchedule = <K extends keyof Schedule>(
    lectureIndex: number,
    scheduleIndex: number,
    key: K,
    val: Schedule[K],
  ) =>
    setValue((prev) => {
      const next = structuredClone(prev);
      next[lectureIndex].schedules[scheduleIndex][key] = val;
      return next;
    });

  const handleDateSelect = (
    lectureIndex: number,
    scheduleIndex: number,
    date?: Date,
  ) => {
    const iso = date ? format(date, "yyyy-MM-dd") : undefined;
    updateSchedule(lectureIndex, scheduleIndex, "date", iso as any);
  };

  const addScheduleRow = (lectureIndex: number) =>
    setValue((prev) => {
      const next = structuredClone(prev);
      next[lectureIndex].schedules.push({
        date: undefined,
        time: "",
        totalHour: 0,
        topic: "",
        room: "",
        note: null,
      });
      return next;
    });

  const removeScheduleRow = (lectureIndex: number, scheduleIndex: number) =>
    setValue((prev) => {
      const next = structuredClone(prev);
      next[lectureIndex].schedules.splice(scheduleIndex, 1);
      return next;
    });

  const addLectureGroup = () =>
    setValue((prev) => [
      ...prev,
      {
        lectureId: "",
        schedules: [
          {
            date: undefined,
            time: "",
            totalHour: 0,
            topic: "",
            room: "",
            note: null,
          },
        ],
      },
    ]);

  const removeLectureGroup = (lectureIndex: number) =>
    setValue((prev) => prev.filter((_, i) => i !== lectureIndex));

  return (
    <div>
      {value.map((lectureGroup, lectureIndex) => (
        <div key={lectureIndex} className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">ตารางสอน {lectureIndex + 1}</h2>
            {value.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeLectureGroup(lectureIndex)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                ลบหมู่เรียน
              </Button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <Label htmlFor={`lecture-${lectureIndex}`}>หมู่เรียน</Label>
            <Input
              id={`lecture-${lectureIndex}`}
              className="w-32 border-0 border-gray-400 bg-white shadow-md"
              value={lectureGroup.lectureId}
              onChange={(e) => updateLectureId(lectureIndex, e.target.value)}
              placeholder="กรอกเลขหมู่เรียน"
            />
          </div>

          <div className="mt-4">
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
                {lectureGroup.schedules.map((schedule, scheduleIndex) => {
                  const key = `${lectureIndex}-${scheduleIndex}`;
                  const isOpen = !!openKeys[key];

                  return (
                    <TableRow
                      key={scheduleIndex}
                      className="border-0 bg-[#F0F9F6]"
                    >
                      <TableCell>{scheduleIndex + 1}</TableCell>

                      <TableCell>
                        <Popover
                          open={isOpen}
                          onOpenChange={() => toggleDatePicker(key)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-35 justify-between border-0 font-normal"
                            >
                              {schedule.date
                                ? new Date(schedule.date).toLocaleDateString(
                                    "th-TH",
                                    {
                                      day: "numeric",
                                      month: "numeric",
                                      year: "numeric",
                                    },
                                  )
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
                                schedule.date
                                  ? new Date(schedule.date)
                                  : undefined
                              }
                              captionLayout="dropdown"
                              onSelect={(d) =>
                                handleDateSelect(
                                  lectureIndex,
                                  scheduleIndex,
                                  d ?? undefined,
                                )
                              }
                              locale={th}
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>

                      <TableCell>
                        <Input
                          className="w-30 bg-white"
                          placeholder="13:00-16:00"
                          value={schedule.time}
                          onChange={(e) =>
                            updateSchedule(
                              lectureIndex,
                              scheduleIndex,
                              "time",
                              e.target.value,
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          className="w-15 bg-white"
                          type="number"
                          placeholder="3"
                          value={schedule.totalHour}
                          onChange={(e) =>
                            updateSchedule(
                              lectureIndex,
                              scheduleIndex,
                              "totalHour",
                              parseInt(e.target.value) || 0,
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          className="bg-white"
                          value={schedule.topic}
                          onChange={(e) =>
                            updateSchedule(
                              lectureIndex,
                              scheduleIndex,
                              "topic",
                              e.target.value,
                            )
                          }
                          placeholder="หัวข้อการสอน"
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          className="w-20 bg-white"
                          value={schedule.room}
                          onChange={(e) =>
                            updateSchedule(
                              lectureIndex,
                              scheduleIndex,
                              "room",
                              e.target.value,
                            )
                          }
                          placeholder="ห้องเรียน"
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          className="bg-white"
                          value={schedule.note ?? ""}
                          onChange={(e) =>
                            updateSchedule(
                              lectureIndex,
                              scheduleIndex,
                              "note",
                              e.target.value || null,
                            )
                          }
                          placeholder="หมายเหตุ"
                        />
                      </TableCell>

                      <TableCell>
                        {lectureGroup.schedules.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeScheduleRow(lectureIndex, scheduleIndex)
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Button
              variant="outline"
              onClick={() => addScheduleRow(lectureIndex)}
              className="mt-2 w-full border-0 font-bold text-[#34B1BD] hover:bg-[#E0F7FA]"
            >
              <Plus className="mr-1 h-4 w-4" />
              เพิ่มแถว
            </Button>
          </div>
        </div>
      ))}

      <div className="mt-6">
        <Button
          variant="outline"
          onClick={addLectureGroup}
          className="h-15 w-full border-0 bg-[#F4F4F5] text-xl font-bold text-[#34C759]"
        >
          <Plus className="mr-1 h-4 w-4" />
          เพิ่มหมู่เรียน
        </Button>
      </div>
    </div>
  );
}
