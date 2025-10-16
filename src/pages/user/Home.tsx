import WelcomeCard from "@/components/home/WelcomeCard";
import StaticFormCard from "@/components/home/StaticFormCard";
import SendedFormMonth from "@/components/home/SendedFormMonth";
import SchedulesCard from "@/components/home/SchedulesCard";
import { useState, useEffect } from "react";
import { getHomeData, type HomeResponse } from "@/api/user/home";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  translateProgram,
  translateSection,
  getSectionColor,
} from "@/utils/programSectionUtils";

const Home = () => {
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current date for defaults
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() + 543; // Buddhist year
  const currentMonthIndex = currentDate.getMonth();
  const thaiMonths = [
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
  const currentMonth = thaiMonths[currentMonthIndex];

  // Get month and year from URL parameters or use defaults
  const month = searchParams.get("month") || currentMonth;
  const year = searchParams.get("year") || currentYear.toString();

  // Set defaults in URL if not present
  useEffect(() => {
    if (!searchParams.get("month") || !searchParams.get("year")) {
      const newSearchParams = new URLSearchParams(searchParams);
      if (!searchParams.get("month"))
        newSearchParams.set("month", currentMonth);
      if (!searchParams.get("year"))
        newSearchParams.set("year", currentYear.toString());
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, currentMonth, currentYear]);

  useEffect(() => {
    // Only fetch data if we have month and year values (either from URL or defaults)
    if (!month || !year) return;

    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Create query parameters object
        const queryParams: { month?: string; year?: string } = {};
        if (month) queryParams.month = month;
        if (year) queryParams.year = year;

        const data = await getHomeData(queryParams);
        setHomeData(data);
      } catch (error: any) {
        console.error("Error fetching home data:", error);
        setError(error.message);

        // Redirect to login if authentication failed
        if (error.message.includes("login")) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, [navigate, month, year]);

  // Function to update URL parameters
  const updateFilters = (newMonth?: string, newYear?: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (newMonth) {
      newSearchParams.set("month", newMonth);
    } else {
      newSearchParams.delete("month");
    }

    if (newYear) {
      newSearchParams.set("year", newYear);
    } else {
      newSearchParams.delete("year");
    }

    setSearchParams(newSearchParams);
  };

  // Function to clear all filters and go back to defaults
  const clearFilters = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("month", currentMonth);
    newSearchParams.set("year", currentYear.toString());
    setSearchParams(newSearchParams);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-xl text-red-500">
          <p>เกิดข้อผิดพลาด: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-[50px] py-[50px]">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Add filter controls */}
        <div className="mt-4 mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="month" className="text-sm font-medium">
              เดือน:
            </label>
            <select
              id="month"
              value={month || ""}
              onChange={(e) =>
                updateFilters(e.target.value || undefined, year || undefined)
              }
              className="rounded border border-gray-300 px-3 py-2"
            >
              <option value="">ทุกเดือน</option>
              <option value="มกราคม">มกราคม</option>
              <option value="กุมภาพันธ์">กุมภาพันธ์</option>
              <option value="มีนาคม">มีนาคม</option>
              <option value="เมษายน">เมษายน</option>
              <option value="พฤษภาคม">พฤษภาคม</option>
              <option value="มิถุนายน">มิถุนายน</option>
              <option value="กรกฎาคม">กรกฎาคม</option>
              <option value="สิงหาคม">สิงหาคม</option>
              <option value="กันยายน">กันยายน</option>
              <option value="ตุลาคม">ตุลาคม</option>
              <option value="พฤศจิกายน">พฤศจิกายน</option>
              <option value="ธันวาคม">ธันวาคม</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="year" className="text-sm font-medium">
              ปี:
            </label>
            <select
              id="year"
              value={year || ""}
              onChange={(e) =>
                updateFilters(month || undefined, e.target.value || undefined)
              }
              className="rounded border border-gray-300 px-3 py-2"
            >
              <option value="">ทุกปี</option>
              <option value="2567">2567</option>
              <option value="2568">2568</option>
              <option value="2569">2569</option>
              <option value="2570">2570</option>
            </select>
          </div>

          {(month !== currentMonth || year !== currentYear.toString()) && (
            <button
              onClick={clearFilters}
              className="rounded bg-gray-500 px-3 py-2 text-sm text-white hover:bg-gray-600"
            >
              รีเซ็ตเป็นเดือนปัจจุบัน
            </button>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[65%_35%]">
          {/* Left column */}
          <div className="lg:pr-4">
            <WelcomeCard firstname={homeData?.user.firstName || "ผู้ใช้"} />
            <div className="grid h-50 grid-cols-2 gap-5">
              <StaticFormCard
                total={homeData?.total_forms || 0}
                description={`รายวิชาที่ส่งแล้วในเดือน ${month}`}
                graphData="graph"
              />
              <StaticFormCard
                total={homeData?.totalHour || 0}
                description={`ชั่วโมงการสอนสุทธิในเดือน ${month}`}
                graphData="graph"
              />
            </div>
          </div>
          {/* Right column */}
          <div className="hidden h-full flex-col gap-5 lg:flex">
            <div className="rounded bg-red-200 p-4 text-center">
              Dashboard &amp; setting
            </div>
            <SendedFormMonth />
          </div>
        </div>

        <h1 className="mt-10 text-3xl font-bold">รายวิชาทั้งหมด</h1>
        <div className="mt-4 grid gap-5 md:grid-cols-1 lg:grid-cols-2">
          {homeData?.forms && homeData.forms.length > 0 ? (
            homeData.forms.map((form) => (
              <Link to={`/home/${form.id}`} key={form.id}>
                <SchedulesCard
                  key={form.id}
                  subjectId={form.subjectId}
                  sectionId={form.formScheduleDetails[0]?.sectionId || ""}
                  subjectName={form.subjectName}
                  section={translateSection(form.section)}
                  room={form.formScheduleDetails[0]?.schedules[0]?.room || ""}
                  program={translateProgram(form.program)}
                  sectionColorClass={getSectionColor(form.section)}
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              ไม่มีข้อมูลรายวิชา
              {(month || year) && " สำหรับเงื่อนไขที่เลือก"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
