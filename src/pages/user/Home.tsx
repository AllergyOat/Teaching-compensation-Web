import WelcomeCard from "@/components/home/WelcomeCard";
import StaticFormCard from "@/components/home/StaticFormCard";
import SendedFormMonth from "@/components/home/SendedFormMonth";
import { Card } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="m-[50px]">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className=" grid grid-cols-[65%_35%] mt-4">
          <div className="pr-4">
            <WelcomeCard />
            <div className="grid grid-cols-2 gap-5 h-60">
              <StaticFormCard
                total={9}
                description="รายวิชาที่ส่งแล้วในเดือน (month)"
                graphData="graph"
              />
              <StaticFormCard
                total={169}
                description="ชั่วโมงการสอนสุทธิในเดือน (month)"
                graphData="graph"
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 h-full">
            <div className="bg-red-200 h-13 text-center">Dashboard & setting</div>
            <SendedFormMonth />
          </div>
        </div>
        <h1 className="text-3xl font-bold mt-10">รายวิชาทั้งหมด (map all subjects)</h1>
        <div className="flex flex-col mt-4 gap-4">
          <Card className="border-0">Subject 1</Card>
          <Card className="border-0">Subject 2</Card>
          <Card className="border-0">Subject 3</Card>
        </div>
      </div>
    </div>
  );
};
export default Home;
