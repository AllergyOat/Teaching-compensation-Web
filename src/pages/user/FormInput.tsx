import documentsImg from "@/assets/images/documents.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { th } from "date-fns/locale";
import { useSearchParams } from "react-router";
import {
  translateProgram,
  translateSection,
} from "@/utils/programSectionUtils";

const FormInput = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Get query parameters
  const [searchParams] = useSearchParams();
  const program = searchParams.get("program") || "";
  const section = searchParams.get("section") || "";
  const programThai = translateProgram(program);
  const sectionThai = translateSection(section);

  return (
    <div>
      <header>
        <div className="flex items-center gap-4 bg-[#02BC77] p-4 pl-10 text-3xl font-bold text-white shadow-md">
          <img src={documentsImg} alt="Documents" className="h-30 w-20" />
          <h1>
            แบบฟอร์มการสอน{sectionThai} {programThai}
          </h1>
        </div>
      </header>
      <main className="flex flex-col items-center justify-start">
        <div className="mt-4 w-10/12">
          <div>Breadcrumb</div>

          <div>
            <h2 className="mt-4 text-2xl font-bold">ข้อมูลแบบรายงาน</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label htmlFor="month">แบบรายงานการสอนประจำเดือน</Label>
                <Input className="shadow-md" id="month"></Input>
              </div>
              <div>
                <Label>ภาคการศึกษา</Label>
                <Input className="shadow-md"></Input>
              </div>
              <div>
                <Label>ปีการศึกษา</Label>
                <Input className="shadow-md"></Input>
              </div>
              <div>
                <Label>รหัสรายวิชา</Label>
                <Input className="shadow-md"></Input>
              </div>
              <div>
                <Label>วิชา</Label>
                <Input className="shadow-md"></Input>
              </div>
              <div>
                <Label>something</Label>
                <Input className="shadow-md"></Input>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mt-8 text-2xl font-bold">ตารางการสอน</h2>
            <div>
              <div className="mt-4 flex gap-4">
                <Label>หมู่เรียน</Label>
                <Input className="w-20 border-1 border-gray-400 shadow-md"></Input>
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
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow className="border-0 bg-[#F0F9F6]">
                      <TableCell>1</TableCell>

                      <TableCell>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date"
                              className="w-35 justify-between border-0 font-normal"
                            >
                              {date
                                ? date.toLocaleDateString("th-TH", {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                  })
                                : "เลือกวันที่"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={date}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                setDate(date);
                                setOpen(false);
                              }}
                              locale={th}
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>

                      <TableCell>
                        <Input
                          className="w-30 bg-white"
                          placeholder="13:00-16:00"
                        />
                      </TableCell>
                      <TableCell>
                        <Input className="w-15 bg-white" placeholder="3" />
                      </TableCell>
                      <TableCell>
                        <Input className="bg-white" />
                      </TableCell>
                      <TableCell>
                        <Input className="w-20 bg-white" />
                      </TableCell>
                      <TableCell>
                        <Input className="bg-white" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="mt-10">//more schedules</div>
              </div>
            </div>
          </div>
          <div>
            <h2>+ เพิ่มหมู่เรียน</h2>
          </div>
          <div>
            <Button className="bg-green-600">ส่งแบบฟอร์ม</Button>
          </div>
        </div>
      </main>
    </div>
  );
};
export default FormInput;
