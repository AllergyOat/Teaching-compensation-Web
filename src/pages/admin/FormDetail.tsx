import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getFormDetail, type Root } from "../../api/forms/detail";
import { updateFormStatus } from "../../api/forms/editStatus";
import {
  translateProgram,
  translateSection,
} from "@/utils/programSectionUtils";
import { CheckCircle, Printer, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  genereteOutput1Docx,
  genereteOutput2Docx,
  generateOutput3Docx,
} from "../../api/docx/adminDocx";
import {
  generateSchedulesDocx,
  generateCompensationDocx,
} from "../../api/docx/userDocx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormDetail = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Root | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Dialog states
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [adminComment, setAdminComment] = useState("");

  // Print states
  const [selectedSectionForEvidence, setSelectedSectionForEvidence] =
    useState<string>("");
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");

  // Function to handle form approval
  const handleApprove = async () => {
    if (!formId) return;
    setShowApproveDialog(true);
  };

  const confirmApprove = async () => {
    if (!formId) return;

    try {
      setIsApproving(true);
      await updateFormStatus(formId, {
        status: "APPROVED",
        adminComment: adminComment || undefined,
      });

      toast.success("อนุมัติแบบฟอร์มสำเร็จ!", {
        description: "แบบฟอร์มได้รับการอนุมัติแล้ว",
      });
      setShowApproveDialog(false);
      setAdminComment("");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error("Approve form error:", error);
      toast.error("ไม่สามารถอนุมัติแบบฟอร์มได้", {
        description: error.message,
      });
    } finally {
      setIsApproving(false);
    }
  };

  // Function to handle form rejection
  const handleReject = async () => {
    if (!formId) return;
    setShowRejectDialog(true);
  };

  const confirmReject = async () => {
    if (!formId) return;

    if (!adminComment.trim()) {
      toast.warning("กรุณาระบุเหตุผล", {
        description: "กรุณาระบุเหตุผลในการปฏิเสธแบบฟอร์ม",
      });
      return;
    }

    try {
      setIsRejecting(true);
      await updateFormStatus(formId, {
        status: "REJECTED",
        adminComment: adminComment,
      });

      toast.success("ปฏิเสธแบบฟอร์มสำเร็จ!", {
        description: "แบบฟอร์มได้รับการปฏิเสธแล้ว",
      });
      setShowRejectDialog(false);
      setAdminComment("");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error("Reject form error:", error);
      toast.error("ไม่สามารถปฏิเสธแบบฟอร์มได้", {
        description: error.message,
      });
    } finally {
      setIsRejecting(false);
    }
  };

  // Function to handle printing selected document
  const handlePrintDocument = async () => {
    if (!formId || !selectedSectionForEvidence) {
      toast.warning("กรุณาเลือกหมู่เรียน", {
        description: "กรุณาเลือกหมู่เรียนที่ต้องการพิมพ์เอกสาร",
      });
      return;
    }

    if (!selectedDocumentType) {
      toast.warning("กรุณาเลือกประเภทเอกสาร", {
        description: "กรุณาเลือกประเภทเอกสารที่ต้องการพิมพ์",
      });
      return;
    }

    try {
      let blob: Blob;
      let filename: string;

      switch (selectedDocumentType) {
        case "evidence":
          blob = await genereteOutput1Docx(formId, selectedSectionForEvidence);
          filename = `compensation_evidence_${formId}_${selectedSectionForEvidence}.docx`;
          break;
        case "payment":
          blob = await genereteOutput2Docx(formId, selectedSectionForEvidence);
          filename = `payment_evidence_${formId}_${selectedSectionForEvidence}.docx`;
          break;
        case "summary":
          blob = await generateOutput3Docx(formId, selectedSectionForEvidence);
          filename = `summary_schedule_${formId}_${selectedSectionForEvidence}.docx`;
          break;
        default:
          toast.error("ประเภทเอกสารไม่ถูกต้อง");
          return;
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("ดาวน์โหลดเอกสารสำเร็จ!");
    } catch (error: any) {
      console.error("Print document error:", error);
      toast.error("ไม่สามารถสร้างเอกสารได้", {
        description: error.message,
      });
    }
  };

  // Function to handle printing user schedules document
  const handlePrintUserSchedules = async () => {
    if (!formId || !selectedSectionForEvidence) {
      toast.warning("กรุณาเลือกหมู่เรียน", {
        description: "กรุณาเลือกหมู่เรียนที่ต้องการพิมพ์เอกสาร",
      });
      return;
    }

    try {
      const blob = await generateSchedulesDocx(
        formId,
        selectedSectionForEvidence,
      );

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `teaching_report_${formId}_${selectedSectionForEvidence}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("ดาวน์โหลดเอกสารสำเร็จ!");
    } catch (error: any) {
      console.error("Print user schedules error:", error);
      toast.error("ไม่สามารถสร้างเอกสารได้", {
        description: error.message,
      });
    }
  };

  // Function to handle printing user compensation document
  const handlePrintUserCompensation = async () => {
    if (!formId || !selectedSectionForEvidence) {
      toast.warning("กรุณาเลือกหมู่เรียน", {
        description: "กรุณาเลือกหมู่เรียนที่ต้องการพิมพ์เอกสาร",
      });
      return;
    }

    try {
      const blob = await generateCompensationDocx(
        formId,
        selectedSectionForEvidence,
      );

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `compensation_memo_${formId}_${selectedSectionForEvidence}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("ดาวน์โหลดเอกสารสำเร็จ!");
    } catch (error: any) {
      console.error("Print user compensation error:", error);
      toast.error("ไม่สามารถสร้างเอกสารได้", {
        description: error.message,
      });
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormDetail();
  }, [formId]);

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
            onClick={() => navigate("/admin/home")}
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Section */}
      <div className="bg-gradient-to-r from-[#02BC77] to-[#006B42] p-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start gap-6">
            <div className="text-6xl">📋</div>
            <div>
              <h1 className="mb-2 text-3xl font-bold">
                แบบฟอร์มการสอน{translateSection(form.section)}{" "}
                {translateProgram(form.program)}
              </h1>
              <p className="text-lg font-bold text-white">
                อาจารย์: {form.user.firstName} {form.user.lastName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/admin")}
            className="text-gray-700 hover:text-gray-900"
          >
            ← กลับสู่หน้าหลัก
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => navigate(`/admin/form/edit/${formId}`)}
            >
              แก้ไขฟอร์ม
            </Button>
            <Button
              variant="outline"
              className="text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={handleApprove}
              disabled={isApproving || form.status === "APPROVED"}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isApproving ? "กำลังอนุมัติ..." : "อนุมัติ"}
            </Button>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 transition-all hover:bg-red-50 hover:text-red-700"
              onClick={handleReject}
              disabled={isRejecting || form.status === "REJECTED"}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {isRejecting ? "กำลังปฏิเสธ..." : "ปฏิเสธ"}
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
        <Card className="overflow-hidden border-0 border-none p-0 shadow-lg transition-shadow hover:shadow-xl">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-[#02BC77] to-[#006B42] p-4 text-white">
            <CardTitle className="text-xl font-bold">
              {translateProgram(form.program)} -{" "}
              {translateSection(form.section)}
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <h3 className="text-lg font-semibold">{form.subjectName}</h3>
                  <p className="font-semibold text-gray-600">
                    {form.subjectId}
                  </p>
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
                    <span className="font-medium">อีเมล:</span>{" "}
                    {form.user.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="bg-white text-purple-500 hover:bg-gray-100"
                  onClick={handlePrintUserSchedules}
                  disabled={!selectedSectionForEvidence}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  พิมพ์แบบรายงานการสอน
                </Button>
                <Button
                  variant="outline"
                  className="bg-white text-indigo-500 hover:bg-gray-100"
                  onClick={handlePrintUserCompensation}
                  disabled={!selectedSectionForEvidence}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  พิมพ์บันทึกข้อความชดเชย
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Details */}
        <Card className="overflow-hidden border-0 p-0 shadow-lg transition-shadow hover:shadow-xl">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-[#02BC77] to-[#006B42] p-6 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">ตารางการสอน</CardTitle>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedSectionForEvidence}
                  onValueChange={setSelectedSectionForEvidence}
                >
                  <SelectTrigger className="w-[200px] bg-white text-gray-900">
                    <SelectValue placeholder="เลือกหมู่เรียน" />
                  </SelectTrigger>
                  <SelectContent>
                    {form.formScheduleDetails.map((section: any) => (
                      <SelectItem key={section.id} value={section.sectionId}>
                        หมู่เรียน {section.sectionId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedDocumentType}
                  onValueChange={setSelectedDocumentType}
                >
                  <SelectTrigger className="w-[280px] bg-white text-gray-900">
                    <SelectValue placeholder="เลือกประเภทเอกสาร" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="evidence">แบบเบิกเงินค่าสอน</SelectItem>
                    <SelectItem value="payment">
                      หลักฐานการเบิกจ่ายเงินค่าสอน
                    </SelectItem>
                    <SelectItem value="summary">ตารางสอน</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={handlePrintDocument}
                  disabled={
                    !selectedSectionForEvidence || !selectedDocumentType
                  }
                >
                  <Printer className="mr-2 h-4 w-4" />
                  พิมพ์เอกสาร
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-6">
            {form.formScheduleDetails.map((section: any, index: number) => (
              <div key={section.id} className={`${index > 0 ? "mt-8" : ""}`}>
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
                        <TableHead className="text-white">
                          วัน/เดือน/ปี
                        </TableHead>
                        <TableHead className="text-white">เวลา</TableHead>
                        <TableHead className="text-white">
                          จำนวนชั่วโมง
                        </TableHead>
                        <TableHead className="text-white">หัวข้อ</TableHead>
                        <TableHead className="text-white">ห้องเรียน</TableHead>
                        <TableHead className="text-white">หมายเหตุ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {section.schedules.map(
                        (schedule: any, scheduleIndex: number) => (
                          <TableRow
                            className={`transition-colors ${
                              scheduleIndex % 2 === 0
                                ? "bg-green-50/50"
                                : "bg-white"
                            } hover:bg-green-100`}
                            key={schedule.id}
                          >
                            <TableCell className="font-medium">
                              {scheduleIndex + 1}
                            </TableCell>
                            <TableCell>{formatDate(schedule.date)}</TableCell>
                            <TableCell>{schedule.time}</TableCell>
                            <TableCell className="font-medium">
                              {schedule.totalHour}
                            </TableCell>
                            <TableCell>{schedule.topic}</TableCell>
                            <TableCell>{schedule.room}</TableCell>
                            <TableCell className="text-gray-500">
                              {schedule.note || "-"}
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Compensation Records Table */}
                {section.compensation && section.compensation.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                      <h4 className="text-base font-semibold text-orange-600">
                        บันทึกข้อความการสอนชดเชย (หมู่เรียน {section.sectionId})
                      </h4>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-orange-200 shadow-sm">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-orange-400 to-orange-400">
                            <TableHead className="text-white">ลำดับ</TableHead>
                            <TableHead className="text-white">
                              จากเดิมวันที่
                            </TableHead>
                            <TableHead className="text-white">
                              จากเดิมเวลา
                            </TableHead>
                            <TableHead className="text-white">
                              ชดเชยเป็นวันที่
                            </TableHead>
                            <TableHead className="text-white">
                              ขอชดเชยเป็นเวลา
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {section.compensation.map(
                            (comp: any, compIndex: number) => (
                              <TableRow
                                className={`transition-colors ${
                                  compIndex % 2 === 0
                                    ? "bg-orange-50/50"
                                    : "bg-white"
                                } hover:bg-orange-100`}
                                key={compIndex}
                              >
                                <TableCell className="font-medium">
                                  {compIndex + 1}
                                </TableCell>
                                <TableCell>
                                  {formatDate(comp.originalDate)}
                                </TableCell>
                                <TableCell>{comp.originalTime}</TableCell>
                                <TableCell className="font-medium text-orange-600">
                                  {formatDate(comp.newDate)}
                                </TableCell>
                                <TableCell className="font-medium text-orange-600">
                                  {comp.newTime}
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Reasons Section */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-base">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                        <span className="font-semibold text-orange-600">
                          เหตุผล:{" "}
                        </span>
                        <span className="text-gray-700">
                          {section.compensation[0]?.reason || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="mt-6 rounded-lg p-4">
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
              <CardTitle className="text-xl font-bold">
                ความเห็นจากผู้ดูแลระบบ
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-gray-800">{form.adminComment}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>อนุมัติแบบฟอร์ม</DialogTitle>
            <DialogDescription>
              ตรวจสอบข้อมูลสรุปค่าตอบแทนก่อนอนุมัติ
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Summary by Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">
                สรุปค่าตอบแทนแต่ละหมู่เรียน
              </h3>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>หมู่เรียน</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead className="text-right">จำนวนชั่วโมง</TableHead>
                      <TableHead className="text-right">
                        จำนวนเงิน (บาท)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.formScheduleDetails.map((section: any) => (
                      <TableRow key={section.id}>
                        <TableCell className="font-medium">
                          {section.sectionId}
                        </TableCell>
                        <TableCell>
                          {section.kind === "LECTURE" ? "บรรยาย" : "ปฏิบัติการ"}
                        </TableCell>
                        <TableCell className="text-right">
                          {section.totalHours.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {section.amount.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Grand Total */}
            <div className="space-y-2 rounded-lg bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">
                  รวมจำนวนชั่วโมงทั้งสิ้น:
                </span>
                <span className="text-xl font-bold text-green-700">
                  {form.totalHourAmount.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ชั่วโมง
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-green-200 pt-2">
                <span className="font-semibold text-gray-700">
                  ยอดรวมสุทธิ:
                </span>
                <span className="text-2xl font-bold text-green-800">
                  {form.grandTotal.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  บาท
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowApproveDialog(false);
                setAdminComment("");
              }}
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              onClick={confirmApprove}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isApproving ? "กำลังดำเนินการ..." : "ยืนยันการอนุมัติ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ปฏิเสธแบบฟอร์ม</DialogTitle>
            <DialogDescription>
              กรุณาระบุเหตุผลในการปฏิเสธแบบฟอร์มนี้
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reject-comment">
                เหตุผล <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reject-comment"
                placeholder="ระบุเหตุผลในการปฏิเสธ..."
                value={adminComment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setAdminComment(e.target.value)
                }
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setAdminComment("");
              }}
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              onClick={confirmReject}
              disabled={isRejecting || !adminComment.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRejecting ? "กำลังดำเนินการ..." : "ยืนยันการปฏิเสธ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormDetail;
