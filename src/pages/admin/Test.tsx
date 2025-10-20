// AdminHomeSimple.tsx
import React, { useEffect, useState } from "react";
import { getAdminHomeData, type Root } from "../../api/admin/home";

const Test: React.FC = () => {
  const [data, setData] = useState<Root | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAdminHomeData(); // no params -> all
        setData(res);
      } catch (e: any) {
        setErr(e?.message ?? "Fetch failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-4">Loading…</div>;
  if (err) return <div className="p-4 text-red-600">Error: {err}</div>;
  if (!data) return <div className="p-4">No data</div>;
  return (
    <div className="space-y-6 p-4">
      <div>
        <h1>ทั้งหมด: {data.statistics.totalForms}</h1>
        <h2>รอดำเนินการ: {data.statistics.totalPending}</h2>
        <h2>อนุมัติ: {data.statistics.totalApproved}</h2>
        <h2>ถูกปฏิเสธ: {data.statistics.totalRejected}</h2>
      </div>
      <div>
        <h3>ข้อมูล ADMIN</h3>
        <h1>{data.myInformation.firstName} {data.myInformation.lastName}</h1>
        <h2>ตำแหน่ง: {data.myInformation.role}</h2>
        <h2>สาขา: {data.myInformation.major}</h2>
      </div>
      {data.usersWithForms.map((u) => (
        <div key={u.userId} className="rounded-lg border p-4">
          <div className="mb-3">
            <div className="text-lg font-semibold">
              {u.userName || "ไม่ระบุชื่อ"}
            </div>
            <div className="text-sm text-gray-600">
              ID: {u.userInfo?.id} • {u.userInfo?.firstName ?? "—"}{" "}
              {u.userInfo?.lastName ?? ""} • สาขา: {u.userInfo?.major ?? "—"}
            </div>
          </div>

          {u.forms.length === 0 ? (
            <div className="text-sm text-gray-500">No forms</div>
          ) : (
            <div className="space-y-3">
              {u.forms.map((f) => (
                <div
                  key={f.id}
                  className="rounded-md border bg-white px-3 py-2 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">
                      {f.subjectId} — {f.subjectName}
                    </div>
                    <div
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{
                        background: "#F3F4F6",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      {f.status}
                    </div>
                  </div>

                  <div className="mt-1 text-gray-700">
                    ภาค: {f.semester} • เดือน: {f.month} • ปี: {f.year}
                  </div>
                  <div className="text-gray-700">
                    โปรแกรม: {f.program} • ประเภท: {f.section} • ชดเชย?:{" "}
                    {f.isCompensated ? "ใช่" : "ไม่"}
                  </div>

                  <div className="mt-2 text-gray-700">
                    หมู่เรียน:
                    {f.formScheduleDetails?.length
                      ? " " +
                        f.formScheduleDetails.map((d) => d.sectionId).join(", ")
                      : " —"}
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    สร้าง: {new Date(f.createdAt).toLocaleString()} • อัปเดต:{" "}
                    {new Date(f.updatedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Test;
