import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { getFormDetail, type Root } from "@/api/forms/detail";
import {
  translateProgram,
  translateSection,
} from "@/utils/programSectionUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

const FormDetail = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Root | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to handle form editing
  const handleEditForm = () => {
    if (!formId) return;
    navigate(`/form/edit/${formId}`);
  };

  // Function to handle form deletion
  const handleDeleteForm = async () => {
    if (!formId) return;

    const confirmDelete = window.confirm(
      "คุณแน่ใจหรือไม่ที่จะลบแบบฟอร์มนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้",
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        alert("กรุณาเข้าสู่ระบบก่อนลบแบบฟอร์ม");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/forms/${formId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          alert("เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        if (response.status === 403) {
          alert("คุณไม่มีสิทธิ์ลบแบบฟอร์มนี้");
          return;
        }
        throw new Error("เกิดข้อผิดพลาดในการลบแบบฟอร์ม");
      }

      alert("ลบแบบฟอร์มสำเร็จ!");
      navigate("/home");
    } catch (error: any) {
      console.error("Delete form error:", error);
      alert("ไม่สามารถลบแบบฟอร์มได้: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchFormDetail = async () => {
      if (!formId) {
        setError("Form ID not found");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getFormDetail(formId);
        setFormData(data);
      } catch (error: any) {
        console.error("Error fetching form detail:", error);
        setError(error.message);

        // Redirect to login if authentication failed
        if (error.message.includes("login")) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormDetail();
  }, [formId, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-xl text-red-500">
          <p>เกิดข้อผิดพลาด: {error}</p>
          <button
            onClick={() => navigate("/home")}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">ไม่พบข้อมูลแบบฟอร์ม</div>
      </div>
    );
  }

  const { data: form } = formData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/home" className="text-gray-700">
            ← กลับสู่หน้าหลัก
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              onClick={handleEditForm}
            >
              <Edit className="mr-2 h-4 w-4" />
              แก้ไขแบบฟอร์ม
            </Button>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 transition-all hover:bg-red-50 hover:text-red-700"
              onClick={handleDeleteForm}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "กำลังลบ..." : "ลบแบบฟอร์ม"}
            </Button>
            <Badge className={getStatusColor(form.status)}>
              {form.status === "PENDING"
                ? "รอการอนุมัติ"
                : form.status === "APPROVED"
                  ? "อนุมัติแล้ว"
                  : form.status === "REJECTED"
                    ? "ไม่อนุมัติ"
                    : form.status}
            </Badge>
          </div>
        </div>

        {/* Form Information */}
        <Card className="border-none overflow-hidden border-0 p-0 shadow-lg transition-shadow hover:shadow-xl">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-[#02BC77] to-[#006B42] p-4 text-white">
            <CardTitle className="text-xl font-bold">
              {translateProgram(form.program)} -{" "}
              {translateSection(form.section)}
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4 mb-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
              <div>
                <h3 className="text-lg font-semibold">{form.subjectName}</h3>
                <p className="text-gray-600 font-semibold">{form.subjectId}</p>
              </div>
              <div>
                <p>
                  <span className="font-medium">เดือน:</span> {form.month}
                </p>
                <p>
                  <span className="font-medium">ภาคการศึกษา:</span>{" "}
                  {form.semester}
                </p>
                <p>
                  <span className="font-medium">ปีการศึกษา:</span> {form.year}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">ผู้สอน:</span>{" "}
                  {form.user.position} {form.user.firstName}{" "}
                  {form.user.lastName}
                </p>
                <p>
                  <span className="font-medium">หน่วยงาน:</span>{" "}
                  {form.user.department}
                </p>
                <p>
                  <span className="font-medium">อีเมล:</span> {form.user.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Details */}
        <Card className="overflow-hidden border-0 p-0 shadow-lg transition-shadow hover:shadow-xl">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-[#02BC77] to-[#006B42] p-6 text-white">
            <CardTitle className="text-xl font-bold">ตารางการสอน</CardTitle>
          </CardHeader>
          <CardContent className="mt-6">
            {form.formScheduleDetails.map((section, index) => (
              <div key={section.id} className={`${index > 0 ? 'mt-8' : ''}`}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#02BC77]"></div>
                  <h3 className="text-lg font-semibold text-[#006B42]">
                    หมู่เรียน {section.sectionId} ({section.kind})
                  </h3>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-[#006B42] to-[#02BC77]">
                        <TableHead className="text-white">ลำดับ</TableHead>
                        <TableHead className="text-white">วัน/เดือน/ปี</TableHead>
                        <TableHead className="text-white">เวลา</TableHead>
                        <TableHead className="text-white">จำนวนชั่วโมง</TableHead>
                        <TableHead className="text-white">หัวข้อ</TableHead>
                        <TableHead className="text-white">ห้องเรียน</TableHead>
                        <TableHead className="text-white">หมายเหตุ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {section.schedules.map((schedule, scheduleIndex) => (
                        <TableRow 
                          className={`transition-colors ${
                            scheduleIndex % 2 === 0 ? 'bg-green-50/50' : 'bg-white'
                          } hover:bg-green-100`} 
                          key={schedule.id}
                        >
                          <TableCell className="font-medium">{scheduleIndex + 1}</TableCell>
                          <TableCell>{formatDate(schedule.date)}</TableCell>
                          <TableCell>{schedule.time}</TableCell>
                          <TableCell className="font-medium">{schedule.totalHour}</TableCell>
                          <TableCell>{schedule.topic}</TableCell>
                          <TableCell>{schedule.room}</TableCell>
                          <TableCell className="text-gray-500">{schedule.note || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Compensation Records Table */}
                {section.compensation && section.compensation.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                      <h4 className="text-base font-semibold text-orange-600">
                        บันทึกความการสอนชดเชย (หมู่เรียน {section.sectionId})
                      </h4>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-orange-200 shadow-sm">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-orange-400 to-orange-400">
                            <TableHead className="text-white">ลำดับ</TableHead>
                            <TableHead className="text-white">จากเดิมวันที่</TableHead>
                            <TableHead className="text-white">จากเดิมเวลา</TableHead>
                            <TableHead className="text-white">ชดเชยเป็นวันที่</TableHead>
                            <TableHead className="text-white">ขอชดเชยเป็นเวลา</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {section.compensation.map((comp, compIndex) => (
                            <TableRow 
                              className={`transition-colors ${
                                compIndex % 2 === 0 ? 'bg-orange-50/50' : 'bg-white'
                              } hover:bg-orange-100`} 
                              key={compIndex}
                            >
                              <TableCell className="font-medium">{compIndex + 1}</TableCell>
                              <TableCell>{formatDate(comp.originalDate)}</TableCell>
                              <TableCell>{comp.originalTime}</TableCell>
                              <TableCell className="font-medium text-orange-600">
                                {formatDate(comp.newDate)}
                              </TableCell>
                              <TableCell className="font-medium text-orange-600">
                                {comp.newTime}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="mt-6 rounded-lg  p-4">
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="font-medium">สร้างเมื่อ:</span>
                  <span>{formatDate(form.createdAt)}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">แก้ไขล่าสุด:</span>
                  <span>{formatDate(form.updatedAt)}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Comment */}
        {form.adminComment && (
          <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardTitle className="text-xl font-bold">ความเห็นจากผู้ดูแลระบบ</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-gray-800">{form.adminComment}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
export default FormDetail;
