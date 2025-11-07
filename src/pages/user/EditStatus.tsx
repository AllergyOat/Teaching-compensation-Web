import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateProfile, type ProfileData } from "@/api/user/profile";

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
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await updateProfile(formData);
      setMessage("บันทึกข้อมูลสำเร็จ");
    } catch (error: any) {
      setMessage("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">ข้อมูลส่วนตัว</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">ชื่อ</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="ชื่อ"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">นามสกุล</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="นามสกุล"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="degree">วุฒิการศึกษา</Label>
                  <Input
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="เช่น ป.เอก"
                  />
                </div>
                <div>
                  <Label htmlFor="position">ตำแหน่ง</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="เช่น อ.ดร"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="department">ภาควิชา</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="ภาควิชา"
                />
              </div>

              <div>
                <Label htmlFor="faculty">คณะ</Label>
                <Input
                  id="faculty"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  placeholder="คณะ"
                />
              </div>

              <div>
                <Label htmlFor="major">สาขาวิชา</Label>
                <Input
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="สาขาวิชา"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="type">ประเภทอาจารย์</Label>
                  <Input
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="เช่น อาจารย์ประจำ"
                  />
                </div>
                <div>
                  <Label htmlFor="teachingLevel">ระดับการสอน</Label>
                  <Input
                    id="teachingLevel"
                    name="teachingLevel"
                    value={formData.teachingLevel}
                    onChange={handleChange}
                    placeholder="เช่น ป.ตรี"
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`rounded p-3 ${message.includes("สำเร็จ") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
