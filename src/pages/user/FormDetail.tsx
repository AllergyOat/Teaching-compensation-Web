import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { getFormDetail, type FormDetailResponse } from "@/api/forms/detail";
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
import { Trash2 } from "lucide-react";

const FormDetail = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/home" className="text-gray-700">
            ← กลับสู่หน้าหลัก
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {translateProgram(form.program)} -{" "}
              {translateSection(form.section)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <h3 className="text-lg font-semibold">{form.subjectName}</h3>
                <p className="text-gray-600">{form.subjectId}</p>
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
        <Card>
          <CardHeader>
            <CardTitle>ตารางการสอน</CardTitle>
          </CardHeader>
          <CardContent>
            {form.formScheduleDetails.map((section) => (
              <div key={section.id} className="mb-8">
                <h3 className="mb-4 text-lg font-semibold">
                  หมู่เรียน {section.sectionId} ({section.kind})
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ลำดับ</TableHead>
                      <TableHead>วัน/เดือน/ปี</TableHead>
                      <TableHead>เวลา</TableHead>
                      <TableHead>จำนวนชั่วโมง</TableHead>
                      <TableHead>หัวข้อ</TableHead>
                      <TableHead>ห้องเรียน</TableHead>
                      <TableHead>หมายเหตุ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.schedules.map((schedule, scheduleIndex) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{scheduleIndex + 1}</TableCell>
                        <TableCell>{formatDate(schedule.date)}</TableCell>
                        <TableCell>{schedule.time}</TableCell>
                        <TableCell>{schedule.totalHour}</TableCell>
                        <TableCell>{schedule.topic}</TableCell>
                        <TableCell>{schedule.room}</TableCell>
                        <TableCell>{schedule.note || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Admin Comment */}
        {form.adminComment && (
          <Card>
            <CardHeader>
              <CardTitle>ความเห็นจากผู้ดูแลระบบ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{form.adminComment}</p>
            </CardContent>
          </Card>
        )}

        {/* Timestamps */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1 text-sm text-gray-500">
              <p>สร้างเมื่อ: {formatDate(form.createdAt)}</p>
              <p>แก้ไขล่าสุด: {formatDate(form.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default FormDetail;
