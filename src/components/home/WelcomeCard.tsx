import { Card } from "../ui/card";
import studentImg from "../../assets/images/students.png";

const WelcomeCard = ({ firstname = "ผู้ใช้" }: { firstname?: string }) => {
  return (
    <Card className="mb-6 grid h-67 grid-cols-[3fr_1fr] border-0 bg-[#02BC77] p-0 shadow-md">
      <div className="flex h-full flex-col justify-center pl-8">
        <div className="text-5xl font-bold text-white">
          สวัสดี คุณ{firstname}!
        </div>
        <div className="mt-4 text-lg font-bold text-white">
          ยินดีต้อนรับสู่หน้าแสดงข้อมูลการสอน
        </div>
        <div className="text-lg font-bold text-white">
          ในเดือน(month) ปี (year)
        </div>
        <div className="mt-4 flex gap-4">
          <button className="rounded-md bg-white px-2 py-2 font-bold text-black">
            เลือกเดือน
          </button>
          <button className="rounded-md bg-white px-2 py-2 font-bold text-black">
            เลือกปี
          </button>
        </div>
      </div>
      <div className="">
        <img
          src={studentImg}
          alt="Students"
          className="mt-8 h-50 w-full object-contain"
        />
      </div>
    </Card>
  );
};
export default WelcomeCard;
