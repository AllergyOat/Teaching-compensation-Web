import WelcomeCard from "@/components/home/WelcomeCard";
import StaticFormCard from "@/components/home/StaticFormCard";
import SendedFormMonth from "@/components/home/SendedFormMonth";
import SchedulesCard from "@/components/home/SchedulesCard";
import { useState, useEffect } from "react";
import { getHomeData, type HomeResponse } from "@/api/user/home";
import { useNavigate } from "react-router";
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

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getHomeData();
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
  }, [navigate]);

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
            <WelcomeCard />
            <div className="grid h-50 grid-cols-2 gap-5">
              <StaticFormCard
                total={homeData?.total_forms || 0}
                description="รายวิชาที่ส่งแล้วในเดือน (month)"
                graphData="graph"
              />
              <StaticFormCard
                total={homeData?.totalHour || 0}
                description="ชั่วโมงการสอนสุทธิในเดือน (month)"
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
          {homeData?.forms.map((form) => (
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
          )) || (
            <div className="col-span-full py-8 text-center text-gray-500">
              ไม่มีข้อมูลรายวิชา
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
