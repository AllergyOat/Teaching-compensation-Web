import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Link } from "react-router";
import DialogDeleteSubject from "./DialogDeleteSubject";

// Define types for section
interface SectionData {
  id: string;
  sectionId: string;
  kind: string;
  totalHoursRequired: number;
  hoursUsed: number;
  hoursRemaining: number;
}

interface SubjectData {
  id: string;
  subjectId: string;
  subjectName: string;
  program: string;
  section: string;
  semester?: string; // เพิ่ม semester เพื่อแสดงเมื่อเลือก "ทั้งหมด"
  sections: SectionData[];
}

interface TableSubjectsProps {
  trackingData: SubjectData[];
  semester: string;
  year: string;
  onSemesterChange: (semester: string) => void;
  onYearChange: (year: string) => void;
  loading: boolean;
  onRefresh?: () => void;
}

const TableSubjects: React.FC<TableSubjectsProps> = ({
  trackingData,
  semester,
  year,
  onSemesterChange,
  onYearChange,
  loading,
  onRefresh,
}) => {
  const years = ["2565", "2566", "2567", "2568", "2569", "2570"];
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<SubjectData | null>(
    null,
  );

  const translateSection = (section: string) => {
    return section === "LECTURE" ? "บรรยาย" : "ปฏิบัติการ";
  };

  const handleDelete = (subject: SubjectData) => {
    setSubjectToDelete(subject);
    setShowDeleteDialog(true);
  };
  if (loading) {
    return <div className="p-4">กำลังโหลดข้อมูล...</div>;
  }
  return (
    <div>
      {/* Filter Section */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Select value={semester} onValueChange={onSemesterChange}>
          <SelectTrigger className="w-[140px] bg-white text-gray-900">
            <SelectValue placeholder="เลือกภาคการศึกษา" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ทั้งหมด" className="font-semibold text-gray-900">
              ทั้งหมด
            </SelectItem>
            <SelectItem value="ภาคต้น" className="text-gray-900">
              ภาคต้น
            </SelectItem>
            <SelectItem value="ภาคปลาย" className="text-gray-900">
              ภาคปลาย
            </SelectItem>
            <SelectItem value="ภาคฤดูร้อน" className="text-gray-900">
              ภาคฤดูร้อน
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={onYearChange}>
          <SelectTrigger className="w-[140px] bg-white text-gray-900">
            <SelectValue placeholder="เลือกปี" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {years.map((year) => (
              <SelectItem key={year} value={year} className="text-gray-900">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Header */}
      <div className="my-6 flex items-center justify-between">
        <h3 className="text-5xl font-semibold text-[#0E8240]">
          {semester === "ทั้งหมด" ? "รายวิชาทั้งหมด" : semester}
        </h3>
        {semester !== "ทั้งหมด" && (
          <Link to={`/admin/subject/new?semester=${semester}`}>
            <p className="cursor-pointer text-2xl font-semibold text-[#3CAEE3] hover:text-[#3CAEE3]/80">
              + เพิ่มรายวิชา{semester}
            </p>
          </Link>
        )}
      </div>

      {/* Subjects List */}
      {semester === "ทั้งหมด" ? (
        // แสดงแบบแยกตามภาคเรียนเมื่อเลือก "ทั้งหมด"
        <>
          {["ภาคต้น", "ภาคปลาย", "ภาคฤดูร้อน"].map((semesterName) => {
            const semesterSubjects = trackingData.filter(
              (subject) => subject.semester === semesterName,
            );

            return (
              <div key={semesterName} className="mb-8">
                {/* หัวข้อภาคเรียน */}
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-3xl font-semibold text-[#0E8240]">
                    {semesterName}
                  </h4>
                  <Link to={`/admin/subject/new?semester=${semesterName}`}>
                    <p className="cursor-pointer text-xl font-semibold text-[#3CAEE3] hover:text-[#3CAEE3]/80">
                      + เพิ่มรายวิชา{semesterName}
                    </p>
                  </Link>
                </div>

                {/* ตารางของภาคนี้ */}
                <div className="mb-6 overflow-hidden rounded-lg shadow-md">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-[#C7E7DC]">
                        <TableHead className="px-6 py-4 text-base font-semibold text-gray-800">
                          รหัสวิชา
                        </TableHead>
                        <TableHead className="px-6 py-4 text-base font-semibold text-gray-800">
                          ชื่อวิชา
                        </TableHead>
                        <TableHead className="px-6 py-4 text-base font-semibold text-gray-800">
                          หมู่เรียน
                        </TableHead>
                        <TableHead className="px-6 py-4 text-base font-semibold text-gray-800">
                          ประเภทวิชา
                        </TableHead>
                        <TableHead className="px-6 py-4 text-base font-semibold text-gray-800">
                          จัดการ
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semesterSubjects.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            ไม่มีข้อมูลรายวิชาในภาคนี้
                          </TableCell>
                        </TableRow>
                      ) : (
                        semesterSubjects.map((subject, subjectIndex) => (
                          <TableRow
                            key={`${subject.subjectId}-${subject.semester}-${subjectIndex}`}
                            className={`transition-colors ${
                              subjectIndex % 2 === 0
                                ? "bg-green-50/50"
                                : "bg-white"
                            } hover:bg-green-100`}
                          >
                            <TableCell className="px-6 py-4 text-base">
                              {subject.subjectId}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-base">
                              {subject.subjectName}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-base">
                              {subject.sections
                                .map((section) => section.sectionId)
                                .join(", ")}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-base">
                              {translateSection(subject.section)}
                            </TableCell>
                            <TableCell className="space-x-4 px-6 py-4 text-base">
                              <Link
                                to={`/admin/subject/edit/${subject.sections[0].id}`}
                              >
                                <button className="cursor-pointer font-medium text-[#0E8240] hover:text-[#0E8240]/80">
                                  แก้ไข
                                </button>
                              </Link>
                              <button
                                className="cursor-pointer font-medium text-red-500 hover:text-red-500/80"
                                onClick={() => handleDelete(subject)}
                              >
                                ลบ
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })}
        </>
      ) : trackingData.length === 0 ? (
        <div className="py-8 text-center text-gray-500">ไม่พบข้อมูลรายวิชา</div>
      ) : (
        // แสดงแบบปกติเมื่อเลือกภาคเฉพาะ
        <div className="overflow-hidden rounded-lg shadow-md">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-[#C7E7DC]">
                <TableHead className="px-6 py-4 text-base font-semibold text-gray-800">
                  รหัสวิชา
                </TableHead>
                <TableHead className="px-6 py-4 text-base font-semibold text-gray-800">
                  ชื่อวิชา
                </TableHead>
                <TableHead className="px-6 py-4 text-base font-semibold text-gray-800">
                  หมู่เรียน
                </TableHead>
                <TableHead className="px-6 py-4 text-base font-semibold text-gray-800">
                  ประเภทวิชา
                </TableHead>
                <TableHead className="px-6 py-4 text-base font-semibold text-gray-800">
                  จัดการ
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trackingData.map((subject, subjectIndex) => (
                <TableRow
                  key={`${subject.subjectId}-${subjectIndex}`}
                  className={`transition-colors ${
                    subjectIndex % 2 === 0 ? "bg-green-50/50" : "bg-white"
                  } hover:bg-green-100`}
                >
                  <TableCell className="px-6 py-4 text-base">
                    {subject.subjectId}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-base">
                    {subject.subjectName}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-base">
                    {subject.sections
                      .map((section) => section.sectionId)
                      .join(", ")}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-base">
                    {translateSection(subject.section)}
                  </TableCell>
                  <TableCell className="space-x-4 px-6 py-4 text-base">
                    <Link to={`/admin/subject/edit/${subject.sections[0].id}`}>
                      <button className="cursor-pointer font-medium text-[#0E8240] hover:text-[#0E8240]/80">
                        แก้ไข
                      </button>
                    </Link>
                    <button
                      className="cursor-pointer font-medium text-red-500 hover:text-red-500/80"
                      onClick={() => handleDelete(subject)}
                    >
                      ลบ
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <DialogDeleteSubject
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        subjectToDelete={subjectToDelete}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default TableSubjects;
