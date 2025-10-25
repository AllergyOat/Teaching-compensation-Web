import WelcomeCard from "@/components/home/WelcomeCard";
import StaticFormCard from "@/components/home/StaticFormCard";
import UserInfoCard from "@/components/home/UserInfoCard";
import SchedulesCard from "@/components/home/SchedulesCard";
import { useState, useEffect } from "react";
import { getHomeData, type HomeResponse } from "@/api/user/home";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  translateProgram,
  translateSection,
  getSectionColor,
} from "@/utils/programSectionUtils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import emthyBoxImg from "@/assets/images/empty_box.png";
import { Button } from "@/components/ui/button";
import AmountInfoCard from "@/components/home/AmountInfoCard";

const Home = () => {
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"user" | "money">("user");

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
        <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[65%_35%]">
          {/* Left column */}
          <div className="lg:pr-4">
            <WelcomeCard
              firstname={homeData?.user.firstName || "ผู้ใช้"}
              month={month}
              year={year}
            />
            <div className="grid h-50 grid-cols-2 gap-5">
              <StaticFormCard
                total={homeData?.totalLectureHours || 0}
                description={`ชั่วโมงสอนบรรยายในเดือน ${month}`}
                graphData={homeData?.totalLectureHours || 0}
                maxValue={45}
              />
              <StaticFormCard
                total={homeData?.totalLabHours || 0}
                description={`ชั่วโมงสอนปฎิบัติในเดือน ${month}`}
                graphData={homeData?.totalLabHours || 0}
                maxValue={30}
              />
            </div>
          </div>
          {/* Right column */}
          <div className="hidden h-full flex-col gap-5 lg:flex">
            <div className="grid h-12 w-full grid-cols-2">
              <Button
                onClick={() => setActiveTab("user")}
                className={`h-full w-full rounded-l-md rounded-r-none transition-colors ${
                  activeTab === "user"
                    ? "bg-[#0BA678] text-white hover:bg-[#099963]"
                    : "bg-[#E4E4E4] text-gray-700 hover:bg-[#C8F5E5] hover:text-[#0BA678]"
                }`}
              >
                ข้อมูลผู้ใช้
              </Button>

              <Button
                onClick={() => setActiveTab("money")}
                className={`h-full w-full rounded-l-none rounded-r-md transition-colors ${
                  activeTab === "money"
                    ? "bg-[#0BA678] text-white hover:bg-[#099963]"
                    : "bg-[#E4E4E4] text-gray-700 hover:bg-[#C8F5E5] hover:text-[#0BA678]"
                }`}
              >
                จำนวนเงินที่ได้รับ
              </Button>
            </div>

            {activeTab === "user" ? (
              <UserInfoCard
                firstName={homeData?.user.firstName || "ผู้ใช้"}
                lastName={homeData?.user.lastName || " "}
                degree={homeData?.user.degree || " "}
                department={homeData?.user.department || " "}
                major={homeData?.user.major || " "}
                teachingLevel={homeData?.user.teachingLevel || " "}
                position={homeData?.user.position || " "}
                type={homeData?.user.type || " "}
              />
            ) : (
              <AmountInfoCard
                labAmount={homeData?.totalAmount.labAmount || 0}
                lectureAmount={homeData?.totalAmount.lectureAmount || 0}
              />
            )}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold">รายวิชาทั้งหมด</h1>
          {/* Add filter controls */}
          <div className="mt-4 mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="month" className="text-sm font-medium">
                เดือน:
              </label>
              <Select
                value={month || ""}
                onValueChange={(value) =>
                  updateFilters(value || undefined, year || undefined)
                }
              >
                <SelectTrigger className="rounded border border-gray-300 bg-white px-3 py-2">
                  <SelectValue placeholder="ทุกเดือน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>เลือกเดือน</SelectLabel>
                    {thaiMonths.map((thaiMonth) => (
                      <SelectItem key={thaiMonth} value={thaiMonth}>
                        {thaiMonth}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="year" className="text-sm font-medium">
                ปี:
              </label>
              <Select
                value={year || ""}
                onValueChange={(value) =>
                  updateFilters(month || undefined, value || undefined)
                }
              >
                <SelectTrigger
                  id="year"
                  className="rounded border border-gray-300 bg-white px-3 py-2"
                >
                  <SelectValue placeholder="ทุกปี" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="2567">2567</SelectItem>
                  <SelectItem value="2568">2568</SelectItem>
                  <SelectItem value="2569">2569</SelectItem>
                  <SelectItem value="2570">2570</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(month !== currentMonth || year !== currentYear.toString()) && (
              <Button
                onClick={clearFilters}
                className="rounded bg-[#02BC77] px-3 py-2 text-sm font-bold text-white hover:bg-green-800"
              >
                รีเซ็ตเป็นเดือนปัจจุบัน
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-5 md:grid-cols-1 lg:grid-cols-2">
          {homeData?.forms && homeData.forms.length > 0 ? (
            homeData.forms.map((form) => {
              // Get all section IDs and join them with comma
              const allSectionIds = form.formScheduleDetails
                .map((detail) => detail.sectionId)
                .filter(Boolean)
                .join(", ");

              return (
                <Link to={`/home/${form.id}`} key={form.id}>
                  <SchedulesCard
                    key={form.id}
                    subjectId={form.subjectId}
                    sectionId={allSectionIds || ""}
                    subjectName={form.subjectName}
                    section={translateSection(form.section)}
                    room={form.formScheduleDetails[0]?.schedules[0]?.room || ""}
                    program={translateProgram(form.program)}
                    sectionColorClass={getSectionColor(form.section)}
                  />
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              <img
                src={emthyBoxImg}
                alt="No Data"
                className="mx-auto mt-20 h-50 w-50"
              />
              <p className="text-2xl font-bold">ยังไม่พบข้อมูลในเดือนนี้</p>
            </div>
          )}
        </div>
        <div className="mt-6 text-right">
          ทั้งหมด{" "}
          <span className="font-bold text-[#17C964]">
            {homeData?.forms.length || 0}
          </span>{" "}
          รายวิชา
        </div>
      </div>
    </div>
  );
};
export default Home;
