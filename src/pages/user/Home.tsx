import { Card, CardContent } from "@/components/ui/card";
import studentImg from "../../assets/images/students.png";

const Home = () => {
  return (
    <div className="m-[50px]">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className=" grid grid-cols-[65%_35%] mt-4">
        <div className="pr-4">
          <Card className="bg-[#02BC77] grid grid-cols-[3fr_1fr] border-0 h-67 mb-6 p-0 shadow-md">
            <div className="flex flex-col justify-center h-full pl-8">
              <div className="text-white font-bold text-5xl">
                สวัสดี คุณ(username)!
              </div>
              <div className="text-white text-lg font-bold mt-4">
                ยินดีต้อนรับสู่หน้าแสดงข้อมูลการสอน
              </div>
              <div className="text-white text-lg font-bold">
                ในเดือน(month) ปี (year)
              </div>
              <div className="flex gap-4 mt-4">
                <button className="bg-white text-black font-bold px-2 py-2 rounded-md">
                  เลือกเดือน
                </button>
                <button className="bg-white text-black font-bold px-2 py-2 rounded-md">
                  เลือกปี
                </button>
              </div>
            </div>
            <div className="">
              <img
                src={studentImg}
                alt="Students"
                className="object-contain h-50 mt-8 w-full"
              />
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-5 h-60">
            <Card className="bg-white border-0 shadow-md flex items-center justify-center">
              <CardContent>วิชาที่ส่งแล้ว</CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-md flex items-center justify-center">
              <CardContent>ชั่วโมงการสอนสุทธิ</CardContent>
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-5 h-full">
          <div className="bg-red-200 h-13">Dashboard & setting</div>
          <Card className="bg-[#F0F9F6] h-full shadow-md border-0 flex items-center justify-center">
            <CardContent>เดือนที่ส่ง</CardContent>
          </Card>
        </div>
      </div>
      <h1 className="text-3xl font-bold mt-10">รายวิชาทั้งหมด</h1>
    </div>
  );
};
export default Home;
