import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import registerBG from "../../assets/images/registerBG.png";
import { Link, useNavigate } from "react-router";
import FormInputs from "@/components/authForm/FormInputs";
import type { RegisterFormInputs } from "@/utils/types";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Buttons from "@/components/authForm/Buttons";
import { registerAPI, type LoginResponse } from "@/api/auth/auth";
import { useState } from "react";
import { updateProfile, type ProfileData } from "@/api/user/profile";
import { toast } from "sonner";

const Register = () => {
  const { register, handleSubmit, formState } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const { errors, isSubmitting } = formState;
  const navigate = useNavigate();
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  // Form สำหรับกรอกข้อมูลผู้ใช้
  const [profileData, setProfileData] = useState<ProfileData>({
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
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const registerSubmit = async (data: RegisterFormInputs) => {
    const { accessToken, user }: LoginResponse = await registerAPI(
      data.email,
      data.password,
    );

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    // ตั้งค่าให้แสดง popup กรอกข้อมูลเมื่อเข้าหน้า home
    localStorage.setItem("showProfileDialog", "true");

    // ไปหน้า home
    navigate("/home");
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const profileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!profileData.firstName || !profileData.lastName) {
      toast.warning("ข้อมูลไม่ครบถ้วน", {
        description: "กรุณากรอกชื่อและนามสกุล",
      });
      return;
    }

    if (!profileData.degree || !profileData.position) {
      toast.warning("ข้อมูลไม่ครบถ้วน", {
        description: "กรุณากรอกวุฒิการศึกษาและตำแหน่ง",
      });
      return;
    }

    if (!profileData.department || !profileData.faculty || !profileData.major) {
      toast.warning("ข้อมูลไม่ครบถ้วน", {
        description: "กรุณากรอกภาควิชา คณะ และสาขาวิชา",
      });
      return;
    }

    if (!profileData.type || !profileData.teachingLevel) {
      toast.warning("ข้อมูลไม่ครบถ้วน", {
        description: "กรุณาเลือกประเภทอาจารย์และระดับการสอน",
      });
      return;
    }

    setIsProfileLoading(true);

    try {
      await updateProfile(profileData);
      toast.success("บันทึกข้อมูลสำเร็จ!");
      setShowProfileDialog(false);
    } catch (error: any) {
      toast.error("เกิดข้อผิดพลาด", {
        description: error.message || "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${registerBG})` }}
      >
        <div className="bg-opacity-50 flex min-h-screen items-center justify-center">
          <Card className="bg-opacity-90 flex h-[600px] w-[550px] flex-col items-center border-0 bg-white p-9 shadow-xl">
            <div className="mt-4 space-y-1 text-center">
              <h1 className="text-center text-4xl font-bold">
                สร้างบัญชีของคุณ
              </h1>
              <h2 className="mt-2.5">
                มีบัญชีอยู่แล้ว?{" "}
                <Link to="/login">
                  <span className="text-[#2797C7]">เข้าสู่ระบบ</span>
                </Link>
              </h2>
            </div>
            <form onSubmit={handleSubmit(registerSubmit)}>
              <FormInputs
                register={register}
                name="email"
                type="email"
                placeholder="Email"
                errors={errors}
                className="h-13 w-[450px] rounded-xl border-0 bg-[#F4F4F5] px-4 py-3 transition-all duration-200 placeholder:text-gray-700"
              />
              <FormInputs
                register={register}
                name="password"
                type="password"
                placeholder="Password"
                errors={errors}
                className="h-13 w-[450px] rounded-xl border-0 bg-[#F4F4F5] px-4 py-3 transition-all duration-200 placeholder:text-gray-700"
              />
              <FormInputs
                register={register}
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                errors={errors}
                className="h-13 w-[450px] rounded-xl border-0 bg-[#F4F4F5] px-4 py-3 transition-all duration-200 placeholder:text-gray-700"
              />
              <Buttons
                text="สร้างบัญชี"
                isPending={isSubmitting}
                className="mt-5 h-12 w-[450px] cursor-pointer rounded-2xl bg-[#17C964] text-lg text-black transition-colors hover:bg-[#13b45a]"
              />
            </form>
          </Card>
        </div>
      </div>

      {/* Popup กรอกข้อมูลผู้ใช้ */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              กรอกข้อมูลผู้ใช้
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={profileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">
                  ชื่อ <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="bg-white"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
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
                  value={profileData.lastName}
                  onChange={handleProfileChange}
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
                  value={profileData.degree}
                  onChange={handleProfileChange}
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
                  value={profileData.position}
                  onChange={handleProfileChange}
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
                  value={profileData.department}
                  onChange={handleProfileChange}
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
                  value={profileData.faculty}
                  onChange={handleProfileChange}
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
                value={profileData.major}
                onChange={handleProfileChange}
                placeholder="สาขาวิชา"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="type">
                  ประเภทอาจารย์ <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={profileData.type}
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
                  value={profileData.teachingLevel}
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

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowProfileDialog(false)}
              >
                ข้ามไปก่อน
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isProfileLoading}
              >
                {isProfileLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Register;
