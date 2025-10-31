import { useState } from "react";
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
import { updateProfile, type ProfileData } from "@/api/user/profile";
import { toast } from "sonner";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
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
      onOpenChange(false);
      // Reload home data to show updated profile
      window.location.reload();
    } catch (error: any) {
      toast.error("เกิดข้อผิดพลาด", {
        description: error.message || "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            กรอกข้อมูลผู้ใช้
          </DialogTitle>
          <p className="text-center text-gray-500 text-sm">
            กรุณากรอกข้อมูลส่วนตัวของคุณให้ครบถ้วน
          </p>
        </DialogHeader>

        <form onSubmit={profileSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label
                htmlFor="firstName"
                className="text-sm font-semibold text-gray-700"
              >
                ชื่อ <span className="text-red-500">*</span>
              </Label>
              <Input
                className="bg-gray-50 border-0 focus:ring-2 focus:ring-green-500 rounded-xl mt-1.5 h-11"
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                placeholder="ชื่อ"
              />
            </div>
            <div>
              <Label
                htmlFor="lastName"
                className="text-sm font-semibold text-gray-700"
              >
                นามสกุล <span className="text-red-500">*</span>
              </Label>
              <Input
                className="bg-gray-50 border-0 focus:ring-2 focus:ring-green-500 rounded-xl mt-1.5 h-11"
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                placeholder="นามสกุล"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label
                htmlFor="degree"
                className="text-sm font-semibold text-gray-700"
              >
                วุฒิการศึกษา <span className="text-red-500">*</span>
              </Label>
              <Input
                className="bg-gray-50 border-0 focus:ring-2 focus:ring-green-500 rounded-xl mt-1.5 h-11"
                id="degree"
                name="degree"
                value={profileData.degree}
                onChange={handleProfileChange}
                placeholder="เช่น ป.เอก"
              />
            </div>
            <div>
              <Label
                htmlFor="position"
                className="text-sm font-semibold text-gray-700"
              >
                ตำแหน่ง <span className="text-red-500">*</span>
              </Label>
              <Input
                className="bg-gray-50 border-0 focus:ring-2 focus:ring-green-500 rounded-xl mt-1.5 h-11"
                id="position"
                name="position"
                value={profileData.position}
                onChange={handleProfileChange}
                placeholder="เช่น อ.ดร"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label
                htmlFor="department"
                className="text-sm font-semibold text-gray-700"
              >
                ภาควิชา <span className="text-red-500">*</span>
              </Label>
              <Input
                className="bg-gray-50 border-0 focus:ring-2 focus:ring-green-500 rounded-xl mt-1.5 h-11"
                id="department"
                name="department"
                value={profileData.department}
                onChange={handleProfileChange}
                placeholder="ภาควิชา"
              />
            </div>
            <div>
              <Label
                htmlFor="faculty"
                className="text-sm font-semibold text-gray-700"
              >
                คณะ <span className="text-red-500">*</span>
              </Label>
              <Input
                className="bg-gray-50 border-0 focus:ring-2 focus:ring-green-500 rounded-xl mt-1.5 h-11"
                id="faculty"
                name="faculty"
                value={profileData.faculty}
                onChange={handleProfileChange}
                placeholder="คณะ"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="major"
              className="text-sm font-semibold text-gray-700"
            >
              สาขาวิชา <span className="text-red-500">*</span>
            </Label>
            <Input
              className="bg-gray-50 border-0 focus:ring-2 focus:ring-green-500 rounded-xl mt-1.5 h-11"
              id="major"
              name="major"
              value={profileData.major}
              onChange={handleProfileChange}
              placeholder="สาขาวิชา"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label
                htmlFor="type"
                className="text-sm font-semibold text-gray-700"
              >
                ประเภทอาจารย์ <span className="text-red-500">*</span>
              </Label>
              <Select
                value={profileData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className="w-full bg-gray-50 border-0 focus:ring-2 focus:ring-green-500 rounded-xl mt-1.5 h-11">
                  <SelectValue placeholder="เลือกประเภทอาจารย์" />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-lg rounded-xl">
                  <SelectItem value="อาจารย์ประจำ" className="rounded-lg">
                    อาจารย์ประจำ
                  </SelectItem>
                  <SelectItem value="อาจารย์พิเศษ" className="rounded-lg">
                    อาจารย์พิเศษ
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="teachingLevel"
                className="text-sm font-semibold text-gray-700"
              >
                ระดับการสอน <span className="text-red-500">*</span>
              </Label>
              <Select
                value={profileData.teachingLevel}
                onValueChange={(value) =>
                  handleSelectChange("teachingLevel", value)
                }
              >
                <SelectTrigger className="w-full bg-gray-50 border-0 focus:ring-2 focus:ring-green-500 rounded-xl mt-1.5 h-11">
                  <SelectValue placeholder="เลือกระดับการสอน" />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-lg rounded-xl">
                  <SelectItem value="ปริญญาตรี" className="rounded-lg">
                    ปริญญาตรี
                  </SelectItem>
                  <SelectItem value="บัณฑิตศึกษา" className="rounded-lg">
                    บัณฑิตศึกษา
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl border-2 border-gray-300 hover:bg-gray-100 font-semibold transition-all"
              onClick={() => onOpenChange(false)}
            >
              ข้ามไปก่อน
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              disabled={isProfileLoading}
            >
              {isProfileLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
