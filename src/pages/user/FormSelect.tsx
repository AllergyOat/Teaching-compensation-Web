import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

const Form = () => {
  return (
    <div className="mt-5 flex h-full justify-center">
      <div className="w-full max-w-4xl px-[50px] py-[50px]">
        <div className="mb-6">
          <h2 className="text-lg font-bold">เลือกประเภทแบบฟอร์ม</h2>
        </div>

        <div className="mb-8">
          <p className="font-bold">ภาคปกติ</p>
          <Link to="/form/new?program=REGULAR_PROGRAM&section=LECTURE">
            <Card className="mt-2 h-16 w-full cursor-pointer border-0 shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100 hover:shadow-lg">
              <CardContent className="flex h-full items-center">
                <p>กรอกแบบฟอร์มการสอนหมู่บรรยาย (ภาคปกติ)</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/form/new?program=REGULAR_PROGRAM&section=LAB">
            <Card className="mt-4 h-16 w-full cursor-pointer border-0 shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100 hover:shadow-lg">
              <CardContent className="flex h-full items-center">
                <p>กรอกแบบฟอร์มการสอนหมู่ปฏิบัติ (ภาคปกติ)</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div>
          <p className="font-bold">ภาคพิเศษ</p>
          <Link to="/form/new?program=SPECIAL_PROGRAM&section=LECTURE">
            <Card className="mt-2 h-16 w-full cursor-pointer border-0 shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100 hover:shadow-lg">
              <CardContent className="flex h-full items-center">
                <p>กรอกแบบฟอร์มการสอนหมู่บรรยาย (ภาคพิเศษ)</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/form/new?program=SPECIAL_PROGRAM&section=LAB">
            <Card className="mt-4 h-16 w-full cursor-pointer border-0 shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100 hover:shadow-lg">
              <CardContent className="flex h-full items-center">
                <p>กรอกแบบฟอร์มการสอนหมู่ปฏิบัติ (ภาคพิเศษ)</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Form;
