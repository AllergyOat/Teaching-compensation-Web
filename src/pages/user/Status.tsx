import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatus } from "@/api/user/status";

type StatusCounts = {
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
};

type Form = {
  id: string;
  subjectId: string;
  subjectName: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment: string | null;
};

type StatusData = {
  statusCounts: StatusCounts;
  forms: Form[];
};

const Status = () => {
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        setLoading(true);
        const data = await getStatus();
        setStatusData(data);
      } catch (error: any) {
        console.error("Error fetching status data:", error);
        setError(error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  const getStatusBadge = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "รอดำเนินการ";
      case "APPROVED":
        return "อนุมัติ";
      case "REJECTED":
        return "ไม่อนุมัติ";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">กำลังโหลดข้อมูล...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded bg-red-100 p-4 text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold">สถานะคำขอ</h1>

        {/* Status Summary Cards
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                รอดำเนินการ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {statusData?.statusCounts.PENDING || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                อนุมัติแล้ว
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {statusData?.statusCounts.APPROVED || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                ไม่อนุมัติ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {statusData?.statusCounts.REJECTED || 0}
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Forms List */}
        <Card>
          <CardHeader>
            <CardTitle>รายการคำขอทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData?.forms && statusData.forms.length > 0 ? (
              <div className="space-y-4">
                {statusData.forms.map((form) => (
                  <div
                    key={form.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{form.subjectName}</h3>
                      <p className="text-sm text-gray-600">
                        รหัสวิชา: {form.subjectId}
                      </p>
                      <p className="text-sm text-gray-500">
                        วันที่ส่ง:{" "}
                        {new Date(form.createdAt).toLocaleDateString("th-TH")}
                      </p>
                      {form.adminComment && (
                        <p className="mt-2 text-sm text-gray-700">
                          <strong>ความเห็น:</strong> {form.adminComment}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(form.status)}`}
                      >
                        {getStatusText(form.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                ไม่มีข้อมูลคำขอ
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default Status;
