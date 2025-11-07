import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateProfile,
  getProfile,
  type ProfileData,
} from "@/api/user/profile";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const ProfileEdit = () => {
  const navigate = useNavigate();
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
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsFetching(true);
        const profileData = await getProfile();
        setFormData(profileData);
      } catch (error: any) {
        toast.error("เกิดข้อผิดพลาด", {
          description: "ไม่สามารถโหลดข้อมูลได้",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation - ตรวจสอบข้อมูลที่จำเป็น
    if (!formData.firstName || !formData.lastName) {
      toast.warning("ข้อมูลไม่ครบถ้วน", {
        description: "กรุณากรอกชื่อและนามสกุล",
      });
      return;
    }

    if (!formData.degree || !formData.position) {
      toast.warning("ข้อมูลไม่ครบถ้วน", {
        description: "กรุณากรอกวุฒิการศึกษาและตำแหน่ง",
      });
      return;
    }

    if (!formData.department || !formData.faculty || !formData.major) {
      toast.warning("ข้อมูลไม่ครบถ้วน", {
        description: "กรุณากรอกภาควิชา คณะ และสาขาวิชา",
      });
      return;
    }

    if (!formData.type || !formData.teachingLevel) {
      toast.warning("ข้อมูลไม่ครบถ้วน", {
        description: "กรุณาเลือกประเภทอาจารย์และระดับการสอน",
      });
      return;
    }

    setIsLoading(true);

    try {
      await updateProfile(formData);
      toast.success("บันทึกข้อมูลสำเร็จ!", {
        description: "กำลังนำคุณกลับไปหน้าโปรไฟล์",
      });
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error: any) {
      toast.error("เกิดข้อผิดพลาด", {
        description: error.message || "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <div className="">
          <Link
            to="/home"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            ← กลับสู่หน้าหลัก
          </Link>
          <h1 className="mt-6 mb-6 text-2xl font-semibold">
            แก้ไขข้อมูลผู้ใช้
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">
                  ชื่อ <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="bg-white"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="ชื่อ"
                />
              </div>
              <div>
                <Label htmlFor="lastName">
                  นามสกุล <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="bg-white"
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
                <Label htmlFor="degree">
                  วุฒิการศึกษา <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="bg-white"
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="เช่น ป.เอก"
                />
              </div>
              <div>
                <Label htmlFor="position">
                  ตำแหน่ง <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="bg-white"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="เช่น อ.ดร"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="department">
                  ภาควิชา <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="bg-white"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="ภาควิชา"
                />
              </div>
              <div>
                <Label htmlFor="faculty">
                  คณะ <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="bg-white"
                  id="faculty"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  placeholder="คณะ"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="major">
                สาขาวิชา <span className="text-red-500">*</span>
              </Label>
              <Input
                className="bg-white"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="สาขาวิชา"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="type">
                  ประเภทอาจารย์ <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="เลือกประเภทอาจารย์" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="อาจารย์ประจำ">อาจารย์ประจำ</SelectItem>
                    <SelectItem value="อาจารย์พิเศษ">อาจารย์พิเศษ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teachingLevel">
                  ระดับการสอน <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.teachingLevel}
                  onValueChange={(value) =>
                    handleSelectChange("teachingLevel", value)
                  }
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="เลือกระดับการสอน" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="ปริญญาตรี">ปริญญาตรี</SelectItem>
                    <SelectItem value="บัณฑิตศึกษา">บัณฑิตศึกษา</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={() => navigate("/profile")}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
