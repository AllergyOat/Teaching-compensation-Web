import emptyBoxImage from "@/assets/images/students.png";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { useState } from "react";

const Home = () => {
  // Get current month in Thai
  const getCurrentMonth = () => {
    const monthNames = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const currentDate = new Date();
    return monthNames[currentDate.getMonth()];
  };

  const [searchName, setSearchName] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("ทั้งหมด");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState("2568");

  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const years = ["2565", "2566", "2567", "2568", "2569", "2570"];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-[#014D30] to-[#02BC77] pb-20 pt-8 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-10">
          <div className="flex flex-1 flex-col">
            <h1 className="text-4xl font-bold">ข้อมูลแบบฟอร์มการสอนพิเศษ</h1>
            <p className="mt-2 text-lg opacity-90">ผู้ดูแล : นางสายแก้ว ความดี</p>
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
            <Card className="border-0 bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-xl transition-transform hover:scale-105">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-yellow-900">รอการดำเนินการ</p>
                <p className="mt-2 text-3xl font-bold text-yellow-900">3</p>
              </CardContent>
            </Card>

            {/* Card 2: ดำเนินการสำเร็จ */}
            <Card className="border-0 bg-gradient-to-br from-green-500 to-green-600 shadow-xl transition-transform hover:scale-105">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-white">ดำเนินการสำเร็จ</p>
                <p className="mt-2 text-3xl font-bold text-white">25</p>
              </CardContent>
            </Card>

            {/* Card 3: ปฏิเสธ */}
            <Card className="border-0 bg-gradient-to-br from-red-500 to-red-600 shadow-xl transition-transform hover:scale-105">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-white">ปฏิเสธ</p>
                <p className="mt-2 text-3xl font-bold text-white">3 คำขอ</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl p-10 pt-8">
        {/* Search and Filter Section */}
        <div className="mb-6">
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
            </div>
          </div>
        </div>

        {/* Teacher Name Section */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-[#02BC77]">นายสุระ พินิจกาจ</h2>
        </div>

        {/* Data Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 ">
                    <TableHead className="font-semibold">DocumentID</TableHead>
                    <TableHead className="font-semibold">ประเภท</TableHead>
                    <TableHead className="font-semibold">หลักสูตร</TableHead>
                    <TableHead className="font-semibold">วันที่ส่ง</TableHead>
                    <TableHead className="font-semibold">สถานะ</TableHead>
                    <TableHead className="font-semibold text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Empty state - will be filled with actual data later */}
                  <TableRow className="bg-[#F0F9F6]">
                    <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                      ไม่มีข้อมูล
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
      </div>
    </div>
  );
};
export default Home;
