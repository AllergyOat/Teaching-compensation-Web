import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "../../ui/chart";
import { Pie, PieChart } from "recharts";

interface FormScheduleDetail {
  sectionId: string;
}

interface Form {
  id: string;
  subjectId: string;
  section: string;
  semester: string;
  totalHours: number;
  formScheduleDetails?: FormScheduleDetail[];
}

interface TrackingSection {
  sectionId: string;
  kind: string;
  totalHoursRequired: number;
  hoursUsed: number;
  hoursRemaining: number;
}

interface SemesterTrackingData {
  subjectId: string;
  subjectName: string;
  program: string;
  semester: string;
  section: string;
  sections: TrackingSection[];
}

interface SemesterHoursChartProps {
  filteredForms: Form[];
  selectedSubject: string;
  selectedSemester: string;
  trackingData: SemesterTrackingData[];
}

const SemesterHoursChart = ({ filteredForms, selectedSubject, selectedSemester, trackingData }: SemesterHoursChartProps) => {
  const [selectedSection, setSelectedSection] = useState<string>("");

  const availableSections = useMemo(() => {
    if (!selectedSubject || !selectedSemester) return [];
    
    const sections = new Set<string>();
    filteredForms
      .filter(form => 
        form.semester === selectedSemester && 
        form.subjectId === selectedSubject  // เพิ่ม filter ตามวิชาที่เลือก
      )
      .forEach(form => {
        form.formScheduleDetails?.forEach(detail => {
          if (detail.sectionId) {
            sections.add(detail.sectionId);
          }
        });
      });
    
    return Array.from(sections).sort();
  }, [filteredForms, selectedSubject, selectedSemester]);

  if (!selectedSection && availableSections.length > 0) {
    setSelectedSection(availableSections[0]);
  }

  const calculateSemesterData = useMemo(() => {
    if (!selectedSubject || !selectedSemester || !selectedSection) {
      return null;
    }


    const subjectTracking = trackingData.filter(
      track => track.subjectId === selectedSubject && track.semester === selectedSemester
    );

  
    
    
    
    
    let sectionKind: string | null = null;
    let maxHours = 0;
    let totalHours = 0;  // ใช้ hoursUsed จาก tracking data
    
    subjectTracking.forEach((track) => {
      track.sections.forEach((section) => {
        console.log("Checking section:", section);
        if (section.sectionId === selectedSection) {
          console.log("Found matching section:", section.sectionId, "kind:", section.kind);
          sectionKind = section.kind;
          maxHours = section.totalHoursRequired;
          totalHours = section.hoursUsed;  // ใช้ hoursUsed จาก tracking data
        }
      });
    });
    
    

    // ถ้าไม่เจอ kind จาก tracking data ให้แสดงข้อความแจ้งเตือน
    if (!sectionKind) {
      console.log("No tracking data found for this section");
      return {
        totalLectureHours: 0,
        totalLabHours: 0,
        maxLectureHours: 0,
        maxLabHours: 0,
      };
    }

    if (sectionKind === "LECTURE") {
      return {
        totalLectureHours: totalHours,
        totalLabHours: 0,
        maxLectureHours: maxHours || 45,
        maxLabHours: 0,
      };
    } else if (sectionKind === "LAB") {
      return {
        totalLectureHours: 0,
        totalLabHours: totalHours,
        maxLectureHours: 0,
        maxLabHours: maxHours || 30,
      };
    }

    return null;
  }, [selectedSubject, selectedSemester, selectedSection, filteredForms, trackingData]);

  return (
    <Card className="shadow-lg overflow-hidden border-none rounded-xl bg-transparent p-0">
      <CardHeader className="bg-gradient-to-r from-[#006B42] to-[#02BC77] p-4">
        <h3 className="text-lg font-semibold text-white">
          จำนวนชั่วโมงที่ส่งฟอร์มต่อภาค (วิชาที่เลือก)
        </h3>
      </CardHeader>
      <CardContent className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 relative">
        {calculateSemesterData ? (
          (() => {
            const semesterData = calculateSemesterData;

            const pieChartData = [
              {
                type: "Lecture",
                hours: semesterData.totalLectureHours,
                fill: "#fbbf24",
              },
              {
                type: "Lab",
                hours: semesterData.totalLabHours,
                fill: "#a855f7",
              },
            ];

            const chartConfig = {
              hours: {
                label: "ชั่วโมง",
              },
              Lecture: {
                label: "Lecture",
                color: "#fbbf24",
              },
              Lab: {
                label: "Lab",
                color: "#a855f7",
              },
            };

            return (
              <div className="flex flex-col items-center w-full">
                <div className="absolute top-4 right-4 z-10">
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger className="w-[140px] bg-white text-gray-900 font-semibold shadow-md">
                      <SelectValue placeholder="เลือกหมู่เรียน" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {availableSections.length > 0 ? (
                        availableSections.map((section) => (
                          <SelectItem key={section} value={section} className="text-gray-900">
                            หมู่ {section}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-data" disabled className="text-gray-500">
                          ไม่มีข้อมูลหมู่เรียน
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full h-[320px] flex items-center justify-center">
                  <ChartContainer
                    config={chartConfig}
                    className="w-[320px] h-[320px]"
                  >
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="hours"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      />
                      <ChartLegend
                        content={<ChartLegendContent nameKey="type" />}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                      />
                    </PieChart>
                  </ChartContainer>
                </div>

                <div className="mt-3 w-full grid grid-cols-2 gap-2 px-8">
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-2 rounded-lg border-2 border-yellow-400">
                    <p className="text-xs text-gray-600 font-medium">Lecture</p>
                    <p className="text-lg font-bold text-yellow-600">
                      {semesterData.totalLectureHours}
                    </p>
                    <p className="text-xs text-gray-500">
                      / {semesterData.maxLectureHours} ชั่วโมง
                    </p>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-yellow-500 h-1 rounded-full transition-all duration-300"
                        style={{
                          width: semesterData.maxLectureHours > 0 
                            ? `${Math.min((semesterData.totalLectureHours / semesterData.maxLectureHours) * 100, 100)}%`
                            : '0%',
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      เหลือ {Math.max(semesterData.maxLectureHours - semesterData.totalLectureHours, 0)} ชม.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-2 rounded-lg border-2 border-purple-500">
                    <p className="text-xs text-gray-600 font-medium">Lab</p>
                    <p className="text-lg font-bold text-purple-600">
                      {semesterData.totalLabHours}
                    </p>
                    <p className="text-xs text-gray-500">
                      / {semesterData.maxLabHours} ชั่วโมง
                    </p>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                        style={{
                          width: semesterData.maxLabHours > 0
                            ? `${Math.min((semesterData.totalLabHours / semesterData.maxLabHours) * 100, 100)}%`
                            : '0%',
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      เหลือ {Math.max(semesterData.maxLabHours - semesterData.totalLabHours, 0)} ชม.
                    </p>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">ไม่มีข้อมูลกราฟ</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SemesterHoursChart;
