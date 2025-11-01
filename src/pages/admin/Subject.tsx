import React, { useEffect, useState } from "react";
import emptyBoxImage from "@/assets/images/students.png";
import { getAdminHomeData, type Root } from "../../api/admin/home";
import TableSubjects from "@/components/subject/TableSubjects";
import { getSemesterTracking } from "@/api/forms/semesterTracking";

const Subject = () => {
  const [data, setData] = useState<Root | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<any[]>([]);

  // Filter states - ใช้ค่าเป็นคำตามที่เก็บในฐานข้อมูล
  const [semester, setSemester] = useState<string>("ภาคต้น"); // default ภาคต้น
  const [selectedYear, setSelectedYear] = useState<string>("2568");

  useEffect(() => {
    getHomeAdmin();
  }, []);

  useEffect(() => {
    fetchTrackingData();
  }, [semester, selectedYear]);

  const fetchTrackingData = async () => {
    if (!semester || !selectedYear) return;

    try {
      // ส่ง semester เป็นคำ (ภาคต้น, ภาคปลาย, ภาคฤดูร้อน) และ year เป็น number
      const res = await getSemesterTracking(semester, Number(selectedYear));
      const tracking = res.data || [];
      setTrackingData(tracking);
    } catch (error) {
      setTrackingData([]);
      console.error("Error fetching semester tracking data:", error);
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
          trackingData={trackingData}
          semester={semester}
          year={selectedYear}
          onSemesterChange={setSemester}
          onYearChange={setSelectedYear}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Subject;
