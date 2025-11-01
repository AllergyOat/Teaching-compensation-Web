import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatus } from "@/api/user/status";
import { Link } from "react-router";

type StatusCounts = {
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
};

type Form = {
  id: string;
  subjectId: string;
  subjectName: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment: string | null;
};

type StatusData = {
  statusCounts: StatusCounts;
  forms: Form[];
};

const Status = () => {
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  // Get current month and year automatically
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentYear = (currentDate.getFullYear() + 543).toString(); // Convert to Buddhist year

  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    months[currentMonthIndex],
  );
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [selectedProgram, setSelectedProgram] = useState<
    "ภาคปกติ" | "ภาคพิเศษ"
  >("ภาคปกติ");

  const years = ["2565", "2566", "2567", "2568", "2569", "2570"];

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        setLoading(true);

        // Map program type to API format
        const programParam =
          selectedProgram === "ภาคปกติ" ? "REGULAR_PROGRAM" : "SPECIAL_PROGRAM";

        const data = await getStatus({
          program: programParam,
          month: selectedMonth,
          year: selectedYear,
        });
        setStatusData(data);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching status data:", error);
        setError(error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();
  }, [selectedMonth, selectedYear, selectedProgram]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "รอดำเนินการ";
      case "APPROVED":
        return "อนุมัติ";
      case "REJECTED":
        return "ไม่อนุมัติ";
      default:
        return status;
    }
  };

  const getCardBackground = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-gradient-to-r from-yellow-50 to-yellow-100/50";
      case "APPROVED":
        return "bg-gradient-to-r from-green-50 to-green-100/50";
      case "REJECTED":
        return "bg-gradient-to-r from-red-50 to-red-100/50";
      default:
        return "bg-gradient-to-r from-white to-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">กำลังโหลดข้อมูล...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded bg-red-100 p-4 text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <Card className="border-0 bg-white shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between text-2xl font-bold text-[#006B42]">
            <p className="">ประวัติการส่งแบบรายงาน</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#006B42]">เดือน</span>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[140px] bg-white text-gray-900">
                  <SelectValue placeholder="เลือกเดือน" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {months.map((month) => (
                    <SelectItem
                      key={month}
                      value={month}
                      className="text-gray-900"
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between text-2xl font-bold text-[#02BC77]">
            <p>
              เดือน{selectedMonth} ภาค
              {selectedProgram === "ภาคปกติ" ? "ปกติ" : "พิเศษ"}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#02BC77]">ปี</span>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[140px] bg-white text-gray-900">
                  <SelectValue placeholder="เลือกปี" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {years.map((year) => (
                    <SelectItem
                      key={year}
                      value={year}
                      className="text-gray-900"
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex gap-8 border-b border-gray-300">
            <button
              onClick={() => setSelectedProgram("ภาคปกติ")}
              className={`pb-2 text-base font-semibold transition-colors ${
                selectedProgram === "ภาคปกติ"
                  ? "border-b-[6px] border-[#02BC77] text-[#02BC77]"
                  : "text-[#71717A]"
              }`}
            >
              ภาคปกติ
            </button>
            <button
              onClick={() => setSelectedProgram("ภาคพิเศษ")}
              className={`pb-2 text-base font-semibold transition-colors ${
                selectedProgram === "ภาคพิเศษ"
                  ? "border-b-[6px] border-[#02BC77] text-[#02BC77]"
                  : "text-[#71717A]"
              }`}
            >
              ภาคพิเศษ
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {statusData?.forms && statusData.forms.length > 0 ? (
            <div className="space-y-4">
              {statusData.forms.map((form) => (
                <Link
                  key={form.id}
                  to={`/home/${form.id}`}
                  className={`group flex cursor-pointer items-start justify-between rounded-xl border-0 p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${getCardBackground(form.status)}`}
                >
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#02BC77]"></div>
                      <h3 className="text-lg font-semibold text-gray-800 transition-colors group-hover:text-[#02BC77]">
                        {form.subjectName}
                      </h3>
                    </div>
                    <div className="ml-4 space-y-1.5">
                      <p className="text-sm font-medium text-gray-600">
                        <span className="text-gray-500">รหัสวิชา:</span>{" "}
                        {form.subjectId}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">วันที่ส่ง:</span>{" "}
                        {new Date(form.createdAt).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      {form.adminComment && (
                        <div className="mt-3 rounded-lg bg-blue-50 p-3">
                          <p className="text-sm text-gray-700">
                            <strong className="text-blue-700">ความเห็น:</strong>{" "}
                            {form.adminComment}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-6">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${getStatusBadge(form.status)}`}
                    >
                      {getStatusText(form.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              ไม่มีข้อมูลคำขอ
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default Status;
