import emptyBoxImage from "@/assets/images/students.png";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminHomeData, type Root } from "../../api/admin/home";

const Home = () => {
  // Get current month and year in Thai
  const getCurrentMonth = () => {
    const monthNames = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const currentDate = new Date();
    return monthNames[currentDate.getMonth()];
  };

  const getCurrentYear = () => {
    const currentDate = new Date();
    return (currentDate.getFullYear() + 543).toString(); // Convert to Buddhist year
  };

  // All useState hooks must be at the top
  const [data, setData] = useState<Root | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("ทั้งหมด");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null); // null = show all

  // Check if current selection is today's month/year
  const isCurrentMonthYear = selectedMonth === getCurrentMonth() && selectedYear === getCurrentYear();
  
  // Reset to current month/year
  const resetToCurrentMonth = () => {
    setSelectedMonth(getCurrentMonth());
    setSelectedYear(getCurrentYear());
  };

  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const years = ["2565", "2566", "2567", "2568", "2569", "2570"];
  
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

  // Filter users and forms based on search, program, month, year, and status
  const filteredUsers = data.usersWithForms.filter((user) => {
    // Search filter
    const searchLower = searchName.toLowerCase();
    const matchesSearch = searchName === "" || 
      user.userName.toLowerCase().includes(searchLower) ||
      user.userId.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Check if user has forms matching the filters
    const hasForms = user.forms.some((form) => {
      const matchesProgram = selectedProgram === "ทั้งหมด" ||
        (selectedProgram === "ภาคปกติ" && form.program === "REGULAR_PROGRAM") ||
        (selectedProgram === "ภาคพิเศษ" && form.program === "SPECIAL_PROGRAM");

      const matchesMonth = !selectedMonth || form.month === selectedMonth; // Allow empty month
      const matchesYear = form.year.toString() === selectedYear;
      const matchesStatus = selectedStatus === null || form.status === selectedStatus;

      return matchesProgram && matchesMonth && matchesYear && matchesStatus;
    });

    return hasForms;
  });

  // Get status badge color
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

  const translateProgram = (program: string) => {
    return program === "REGULAR_PROGRAM" ? "ภาคปกติ" : "ภาคพิเศษ";
  };

  const translateSection = (section: string) => {
    return section === "LECTURE" ? "บรรยาย" : "ปฏิบัติการ";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-[#014D30] to-[#02BC77] pb-20 pt-8 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-10">
          <div className="flex flex-1 flex-col">
            <h1 className="text-4xl font-bold">ข้อมูลแบบฟอร์มการสอนพิเศษ</h1>
            <p className="mt-2 text-lg opacity-90">ผู้ดูแล : {data.myInformation.firstName} {data.myInformation.lastName}</p>
          </div>
          <div>
            <img 
              src={emptyBoxImage} 
              alt="Students illustration" 
              className="h-40 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards - Overlapping */}
      <div className="relative -mt-16 px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            
            {/* Card 1: รอการดำเนินการ */}
            <Card 
              className={`border-0 bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-xl transition-transform hover:scale-105 cursor-pointer ${
                selectedStatus === "PENDING" ? "ring-4 ring-yellow-600" : ""
              }`}
              onClick={() => {
                if (selectedStatus === "PENDING") {
                  setSelectedStatus(null);
                } else {
                  setSelectedStatus("PENDING");
                  setSelectedMonth(""); // Clear month selection
                }
              }}
            >
              <CardContent className="p-6">
                <p className="text-sm font-medium text-yellow-900">รอการดำเนินการ</p>
                <p className="mt-2 text-3xl font-bold text-yellow-900">{data.statistics.totalPending}</p>
              </CardContent>
            </Card>

            {/* Card 2: ดำเนินการสำเร็จ */}
            <Card 
              className={`border-0 bg-gradient-to-br from-green-500 to-green-600 shadow-xl transition-transform hover:scale-105 cursor-pointer ${
                selectedStatus === "APPROVED" ? "ring-4 ring-green-700" : ""
              }`}
              onClick={() => {
                if (selectedStatus === "APPROVED") {
                  setSelectedStatus(null);
                } else {
                  setSelectedStatus("APPROVED");
                  setSelectedMonth(""); // Clear month selection
                }
              }}
            >
              <CardContent className="p-6">
                <p className="text-sm font-medium text-white">ดำเนินการสำเร็จ</p>
                <p className="mt-2 text-3xl font-bold text-white">{data.statistics.totalApproved}</p>
              </CardContent>
            </Card>

            {/* Card 3: ปฏิเสธ */}
            <Card 
              className={`border-0 bg-gradient-to-br from-red-500 to-red-600 shadow-xl transition-transform hover:scale-105 cursor-pointer ${
                selectedStatus === "REJECTED" ? "ring-4 ring-red-700" : ""
              }`}
              onClick={() => {
                if (selectedStatus === "REJECTED") {
                  setSelectedStatus(null);
                } else {
                  setSelectedStatus("REJECTED");
                  setSelectedMonth(""); // Clear month selection
                }
              }}
            >
              <CardContent className="p-6">
                <p className="text-sm font-medium text-white">ปฏิเสธ</p>
                <p className="mt-2 text-3xl font-bold text-white">{data.statistics.totalRejected}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl p-10 pt-8">
        {/* Search and Filter Section */}
        <div className="mb-6">
          {/* Status Filter Indicator */}
          {selectedStatus && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">กำลังแสดง:</span>
              <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadge(selectedStatus)}`}>
                {getStatusText(selectedStatus)}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Search and Program Filter */}
            <div className="flex items-center gap-4">
              {/* Search by Name */}
              <div className="relative w-[400px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by name or ID..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
              
              {/* Program Filter */}
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger className="w-[150px] bg-white">
                  <SelectValue placeholder="ทั้งหมด" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="ทั้งหมด">ทั้งหมด</SelectItem>
                  <SelectItem value="ภาคปกติ">ภาคปกติ</SelectItem>
                  <SelectItem value="ภาคพิเศษ">ภาคพิเศษ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right side - Month and Year Selector */}
            <div className="flex items-center gap-4">
              {/* Month Selector */}
              <span className="text-2xl font-bold text-[#006B42]">เดือน</span>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[140px] bg-white text-gray-900">
                  <SelectValue placeholder="เลือกเดือน" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {months.map((month) => (
                    <SelectItem key={month} value={month} className="text-gray-900">
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Selector */}
              <span className="text-2xl font-bold text-[#02BC77]">ปี</span>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[140px] bg-white text-gray-900">
                  <SelectValue placeholder="เลือกปี" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {years.map((year) => (
                    <SelectItem key={year} value={year} className="text-gray-900">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Reset Button - Show when month is selected and not current month/year */}
              {selectedMonth && !isCurrentMonthYear && (
                <button
                  onClick={resetToCurrentMonth}
                  className="rounded-lg bg-[#02BC77] px-4 py-2 text-white font-medium hover:bg-[#048C59] transition-colors"
                >
                  รีเซ็ตเป็นเดือนปัจจุบัน
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Display Users and Their Forms */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            // Filter forms for this user
            const userForms = user.forms.filter((form) => {
              const matchesProgram = selectedProgram === "ทั้งหมด" ||
                (selectedProgram === "ภาคปกติ" && form.program === "REGULAR_PROGRAM") ||
                (selectedProgram === "ภาคพิเศษ" && form.program === "SPECIAL_PROGRAM");

              const matchesMonth = !selectedMonth || form.month === selectedMonth; // Allow empty month
              const matchesYear = form.year.toString() === selectedYear;
              const matchesStatus = selectedStatus === null || form.status === selectedStatus;

              return matchesProgram && matchesMonth && matchesYear && matchesStatus;
            });

            if (userForms.length === 0) return null;

            return (
              <div key={user.userId} className="mb-8">
                {/* Teacher Name Section */}
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-[#02BC77]">{user.userName}</h2>
                  {user.userInfo.major && (
                    <p className="text-sm text-gray-600">สาขา: {user.userInfo.major}</p>
                  )}
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="font-semibold">DocumentID</TableHead>
                        <TableHead className="font-semibold">ประเภท</TableHead>
                        <TableHead className="font-semibold">หลักสูตร</TableHead>
                        <TableHead className="font-semibold">วันที่ส่ง</TableHead>
                        <TableHead className="font-semibold">สถานะ</TableHead>
                        <TableHead className="font-semibold text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userForms.map((form) => (
                        <TableRow key={form.id} className="bg-[#F0F9F6] hover:bg-[#E0F2EC]">
                          <TableCell className="font-medium">{form.subjectId}</TableCell>
                          <TableCell>{translateSection(form.section)}</TableCell>
                          <TableCell>{translateProgram(form.program)}</TableCell>
                          <TableCell>{formatDate(form.createdAt)}</TableCell>
                          <TableCell>
                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(form.status)}`}>
                              {getStatusText(form.status)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <button className="text-blue-600 hover:text-blue-800">
                              ดูรายละเอียด
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
