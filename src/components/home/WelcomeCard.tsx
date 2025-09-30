import { Card } from "../ui/card";
import studentImg from "../../assets/images/students.png";

const WelcomeCard = () => {
  return (
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
  );
};
export default WelcomeCard;
