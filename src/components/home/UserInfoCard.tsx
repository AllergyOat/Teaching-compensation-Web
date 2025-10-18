import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router";

interface UserInfoCardProps {
  firstName: string;
  lastName: string;
  degree: string;
  department: string;
  major: string;
  teachingLevel: string;
  position: string;
  type: string;
}

const UserInfoCard = ({
  firstName,
  lastName,
  degree,
  department,
  major,
  teachingLevel,
  position,
  type,
}: UserInfoCardProps) => {
  return (
    <Card className="h-full border-0 bg-[#F0F9F6] shadow-md">
      <CardContent>
        <div className="flex flex-col justify-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">ข้อมูลผู้ใช้</h1>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#03A96B]">
              {firstName} {lastName}
            </h2>
          </div>
          <div className="flex gap-6">
            <div className="text-md space-y-1 font-bold text-[#8D949A]">
              <p>ระดับการศึกษา :</p>
              <p>สังกัดวิชา :</p>
              <p>สาขาวิชา :</p>
              <p>ระดับการสอน :</p>
              <p>ตำแหน่ง :</p>
              <p>สถานะอาจารย์ :</p>
            </div>
            <div className="text-md space-y-1 font-bold text-black">
              <p>{degree}</p>
              <p>{department}</p>
              <p>{major}</p>
              <p>{teachingLevel}</p>
              <p>{position}</p>
              <p>{type}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Link to="/profile">
              <Button className="cursor-pointer bg-green-500 font-bold">
                แก้ไขข้อมูล
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default UserInfoCard;
