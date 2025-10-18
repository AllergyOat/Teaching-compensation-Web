import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { getProfile, type ProfileData } from "@/api/user/profile";

const Profile = () => {
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    degree: "",
    position: "",
    department: "",
    faculty: "",
    major: "",
    type: "",
    teachingLevel: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsFetching(true);
        const profileData = await getProfile();
        setFormData(profileData);
      } catch (error: any) {
        setMessage("ไม่สามารถโหลดข้อมูลได้: " + error.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  if (isFetching) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Back Link */}
        <Link to="/home" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800">
          ← กลับสู่หน้าหลัก
        </Link>

        {/* Page Title */}
        <h1 className="text-2xl font-bold">ข้อมูลผู้ใช้</h1>

        {/* Profile Header Card */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Profile Avatar */}
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {/* User Info */}
                <div>
                  <p className="text-base font-semibold">{formData.position} {formData.firstName} {formData.lastName}</p>
                  <p className="text-sm text-gray-600">somchai.de@gmail.com</p>
                </div>
              </div>
              
              {/* Edit Button */}
              <Link to="/profile/edit">
                <Button className="bg-green-500 hover:bg-green-600 text-white px-6">
                  แก้ไขข้อมูล
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">ระดับการศึกษา</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{formData.degree}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-gray-900">สถานะอาจารย์</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{formData.position}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">ภาควิชา</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{formData.department}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">สาขาวิชา</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{formData.major}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">ระดับการสอน</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{formData.teachingLevel}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">ตำแหน่ง</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{formData.type}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {message && (
          <div className={`rounded p-3 ${message.includes("สำเร็จ") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
