import { useEffect, useState } from "react";
import emptyBoxImage from "@/assets/images/students.png";
import { getAdminHomeData, type Root } from "../../api/admin/home";
import TableSubjects from "@/components/subject/TableSubjects";
import { listSubjectSectionRates } from "@/api/admin/subject";
// Types for TableSubjects component
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
  semester?: string;
  section: string;
  sections: SectionData[];
}

const Subject = () => {
  const [data, setData] = useState<Root | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<SubjectData[]>([]);

  // Filter states - ใช้ค่าเป็นคำตามที่เก็บในฐานข้อมูล
  const [semester, setSemester] = useState<string>("ทั้งหมด"); // default ทั้งหมด
  const [selectedYear, setSelectedYear] = useState<string>("2568");

  useEffect(() => {
    getHomeAdmin();
  }, []);

  useEffect(() => {
    fetchSubjectData();
  }, [semester]);

  const fetchSubjectData = async () => {
    try {
      setLoading(true);
      // ถ้าเลือก "ทั้งหมด" ไม่ต้องส่ง semester parameter
      const response =
        semester === "ทั้งหมด"
          ? await listSubjectSectionRates()
          : await listSubjectSectionRates(semester);

      if (response.success && response.data) {
        // Transform data และรวมวิชาที่มี subjectId + semester เดียวกัน
        const groupedBySubject = response.data.reduce(
          (acc, item) => {
            // ถ้าเลือก "ทั้งหมด" ให้ group ตาม subjectId + semester
            // ถ้าเลือกภาคเฉพาะให้ group ตาม subjectId เท่านั้น
            const key =
              semester === "ทั้งหมด"
                ? `${item.subjectId}_${item.semester}`
                : item.subjectId;

            if (!acc[key]) {
              // สร้าง entry ใหม่สำหรับวิชานี้
              acc[key] = {
                id: item.id,
                subjectId: item.subjectId,
                subjectName: item.subjectName,
                program: item.program,
                semester: item.semester,
                section: item.section, // เก็บ section แรกที่เจอ (LECTURE หรือ LAB)
                sections: [],
              };
            }

            // รวม sections จากทุก record ที่มี subjectId เดียวกัน
            const transformedSections = item.sections.map((section) => ({
              id: section.id,
              sectionId: section.sectionId,
              kind: section.kind,
              totalHoursRequired: section.MaxTotalHours,
              hoursUsed: section.teacherTotalHours || 0,
              hoursRemaining:
                section.MaxTotalHours - (section.teacherTotalHours || 0),
            }));

            acc[key].sections.push(...transformedSections);

            return acc;
          },
          {} as Record<string, SubjectData>,
        );

        // แปลง object กลับเป็น array
        const transformed = Object.values(groupedBySubject);

        setFilteredData(transformed);
      }
    } catch (error) {
      console.error("Error fetching subject data:", error);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const getHomeAdmin = async () => {
    try {
      const res = await getAdminHomeData(); // no params -> all
      setData(res);
    } catch (e: any) {
      setErr(e?.message ?? "Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading…</div>;
  if (err) return <div className="p-4 text-red-600">Error: {err}</div>;
  if (!data) return <div className="p-4">No data</div>;
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-[#014D30] to-[#02BC77] pt-8 pb-20 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-10">
          <div className="flex flex-1 flex-col">
            <h1 className="text-4xl font-bold">ข้อมูลรายวิชาการสอนทั้งหมด</h1>
            <p className="mt-2 text-lg opacity-90">
              ผู้ดูแล : {data.myInformation.firstName}{" "}
              {data.myInformation.lastName}
            </p>
          </div>
          <div>
            <img
              src={emptyBoxImage}
              alt="Students illustration"
              className="h-40 w-auto"
            />
          </div>
        </div>
      </div>
      {/* ContentSection */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <TableSubjects
          trackingData={filteredData}
          semester={semester}
          year={selectedYear}
          onSemesterChange={setSemester}
          onYearChange={setSelectedYear}
          loading={loading}
          onRefresh={fetchSubjectData}
        />
      </div>
    </div>
  );
};

export default Subject;
