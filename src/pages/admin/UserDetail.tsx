import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getAdminTeacherDetail } from "../../api/admin/teacherDetail";
import type { Root, Form } from "../../api/admin/teacherDetail";
import { getAdminHomeData } from "../../api/admin/home";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Pie, PieChart } from "recharts";
import emptyBoxImage from "@/assets/images/students.png";

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Root | null>(null);
  const [adminInfo, setAdminInfo] = useState<{ firstName: string; lastName: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedProgram, setSelectedProgram] = useState<"ภาคปกติ" | "ภาคพิเศษ">("ภาคปกติ");
  const [selectedMonth, setSelectedMonth] = useState<string>("ทั้งหมด");
  const [selectedDisplayYear, setSelectedDisplayYear] = useState<string>((new Date().getFullYear() + 543).toString());
  const [selectedSemester, setSelectedSemester] = useState<string>("ภาคต้น");

  // Month and Year options
  const months = [
    "ทั้งหมด",
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const years = ["2568", "2567", "2566", "2565"];

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        // แปลงปี ค.ศ. เป็น พ.ศ. สำหรับ API (เพิ่ม 543)
        const buddhistYear = selectedYear + 543;
        
        const [result, adminRes] = await Promise.all([
          getAdminTeacherDetail(userId, buddhistYear),
          getAdminHomeData()
        ]);
        
        setData(result);
        setAdminInfo(adminRes.myInformation);
      } catch (error) {
        console.error("Error fetching teacher detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, selectedYear]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">กำลังโหลด...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-600">ไม่พบข้อมูล</p>
      </div>
    );
  }


  // ใช้ข้อมูลกราฟจาก API โดยตรง
  const chartData = data?.graph1 || [];
  
  // เรียงลำดับเดือน
  const monthOrder = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  
  // สร้างข้อมูลกราฟ graph2 จากฟอร์ม (ถ้าไม่มีจาก API)
  const getGraph2Data = () => {
    let chartData: Array<{ month: string; totalAmount: number; fill?: string }> = [];
    
    if (data?.graph2 && data.graph2.length > 0) {
      // เรียงข้อมูลจาก API ตามลำดับเดือน
      chartData = [...data.graph2].sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
    } else if (data?.forms && data.forms.length > 0) {
      // คำนวณจากฟอร์ม
      const monthlyAmount: Record<string, number> = {};
      data.forms.forEach((form) => {
        const month = form.month;
        if (!monthlyAmount[month]) {
          monthlyAmount[month] = 0;
        }
        monthlyAmount[month] += form.amount;
      });
      
      chartData = Object.entries(monthlyAmount)
        .map(([month, totalAmount]) => ({
          month,
          totalAmount,
        }))
        .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
    } else {
      return [];
    }
    
    // เพิ่มสีสลับให้กับแต่ละเดือน (มกราคม = ม่วง, กุมภาพันธ์ = เหลือง, ...)
    return chartData.map((item, index) => ({
      ...item,
      fill: index % 2 === 0 ? "#a855f7" : "#fbbf24", // สลับสีม่วงและเหลือง
    }));
  };
  
  const graph2Data = getGraph2Data();
  
  // ใช้ข้อมูลกราฟ graph3 จาก API โดยตรง
  const graph3Data = data?.graph3 || [];
  
  // Filter forms based on program, month, and year
  const filteredForms = (data?.forms?.filter((form) => {
    const matchesStatus = form.status === 'APPROVED';
    
    // แปลง program จาก Backend format เป็น Thai format
    const formProgram = form.program === 'REGULAR_PROGRAM' ? 'ภาคปกติ' : 
                        form.program === 'SPECIAL_PROGRAM' ? 'ภาคพิเศษ' : 
                        form.program;
    
    const matchesProgram = formProgram === selectedProgram;
    const matchesMonth = selectedMonth === "ทั้งหมด" || form.month === selectedMonth;
    
    // เช็คปี - Backend เก็บปีเป็น พ.ศ. อยู่แล้ว ไม่ต้องแปลง
    const matchesYear = form.year === parseInt(selectedDisplayYear);
    
    return matchesStatus && matchesProgram && matchesMonth && matchesYear;
  }) || []).sort((a, b) => {
    // เรียงตามเดือน
    const monthOrder = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-[#014D30] to-[#02BC77] pb-20 pt-8 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-10">
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/user")}
                className="text-white border-white hover:bg-white/20 hover:border-white px-4 py-2 font-semibold transition-colors bg-transparent"
                style={{ color: 'white' }}
              >
                <span className="flex items-center gap-1">
                  <span>←</span>
                  <span>ย้อนกลับ</span>
                </span>
              </Button>
            </div>
            <h1 className="text-4xl font-bold">
              {data.summary.user.firstName} {data.summary.user.lastName}
            </h1>
            <p className="mt-2 text-lg opacity-90">
              ผู้ดูแล : {adminInfo?.firstName} {adminInfo?.lastName}
            </p>
            <div className="mt-3 flex items-center gap-6">
              <div className="flex items-baseline gap-2">
                <span className="text-sm opacity-90">ยอดเบิกเงินรวมทั้งหมด :</span>
                <span className="text-3xl font-bold">
                  ฿{data.summary.grand.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-90">ปีการศึกษา:</span>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
                  <SelectTrigger className="w-[100px] bg-white text-gray-900 font-semibold border-2 border-white hover:bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="2025" className="text-gray-900">2568</SelectItem>
                    <SelectItem value="2024" className="text-gray-900">2567</SelectItem>
                    <SelectItem value="2023" className="text-gray-900">2566</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div>
            <img 
              src={emptyBoxImage} 
              alt="Teacher illustration" 
              className="h-40 w-auto"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-10 pt-8 pb-8">
        {/* Title */}
        <h2 className="text-xl font-bold text-[#0E8240] mb-4">ข้อมูลฟอร์ม</h2>

        {/* Chart Section - Lecture vs Lab Comparison */}
        <Card className="shadow-lg mb-6 overflow-hidden border-2 border-[#006B42] rounded-xl bg-transparent p-0">
          <CardHeader className="bg-gradient-to-r from-[#006B42] to-[#02BC77] p-4">
            <h3 className="text-lg font-semibold text-white">
              กราฟเปรียบเทียบจำนวนรายวิชา Lecture และ Lab
            </h3>
          </CardHeader>
          <CardContent className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
            {chartData && chartData.length > 0 ? (
              <ChartContainer
                config={{
                  Lecture: {
                    label: "Lecture",
                    color: "#fbbf24", // สีเหลืองอ่อน (yellow-400)
                  },
                  Lab: {
                    label: "Lab",
                    color: "#a855f7", // สีฟ้าอ่อน (blue-400)
                  },
                }}
                className="h-[320px] w-full bg-transparent"
              >
                <BarChart data={chartData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#d1d5db"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#000000', fontSize: 12, fontWeight: 700 }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                  />
                  <ChartLegend
                    content={<ChartLegendContent />}
                    className="mt-4"
                  />
                  <Bar 
                    dataKey="Lecture" 
                    fill="var(--color-Lecture)" 
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar 
                    dataKey="Lab" 
                    fill="var(--color-Lab)" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">ไม่มีข้อมูลกราฟ</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Horizontal Bar Chart - Monthly Amount */}
          <Card className="shadow-lg overflow-hidden border-2 border-[#006B42] rounded-xl bg-transparent p-0">
            <CardHeader className="bg-gradient-to-r from-[#006B42] to-[#02BC77] p-4">
              <h3 className="text-lg font-semibold text-white">
                จำนวนเงินที่เบิกในแต่ละเดือน
              </h3>
            </CardHeader>
            <CardContent className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
              {graph2Data && graph2Data.length > 0 ? (
                <ChartContainer
                  config={{
                    totalAmount: {
                      label: "จำนวนเงิน",
                      color: "#10b981",
                    },
                  }}
                  className="h-[320px] w-full bg-transparent"
                >
                  <BarChart data={graph2Data} layout="vertical">
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      horizontal={false}
                      stroke="#d1d5db"
                    />
                    <XAxis 
                      type="number"
                      tick={{ fill: '#000000', fontSize: 12, fontWeight: 700 }}
                    />
                    <YAxis 
                      dataKey="month" 
                      type="category"
                      width={80}
                      tick={{ fill: '#000000', fontSize: 12, fontWeight: 700 }}
                      reversed={true}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Bar 
                      dataKey="totalAmount" 
                      fill="var(--color-totalAmount)"
                      radius={[0, 8, 8, 0]}
                    >
                      <LabelList 
                        dataKey="totalAmount" 
                        position="insideRight"
                        formatter={(value: number) => `฿${value.toLocaleString()}`}
                        style={{ fill: 'white', fontSize: 14, fontWeight: 700 }}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">ไม่มีข้อมูลกราฟ</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pie Chart - Hours by Semester */}
          <Card className="shadow-lg overflow-hidden border-2 border-[#006B42] rounded-xl bg-transparent p-0">
            <CardHeader className="bg-gradient-to-r from-[#006B42] to-[#02BC77] p-4">
              <h3 className="text-lg font-semibold text-white">
                จำนวนชั่วโมงที่ส่งฟอร์มต่อภาค
              </h3>
            </CardHeader>
            <CardContent className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 relative">
              {graph3Data && graph3Data.length > 0 ? (
                (() => {
                  const semesterData = graph3Data.find(item => item.semester === selectedSemester);
                  if (!semesterData) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-gray-500">ไม่มีข้อมูลสำหรับภาคเรียนนี้</p>
                      </div>
                    );
                  }

                  const pieChartData = [
                    {
                      type: "Lecture",
                      hours: semesterData.totalLectureHours,
                      fill: "#fbbf24", // yellow-400
                    },
                    {
                      type: "Lab",
                      hours: semesterData.totalLabHours,
                      fill: "#a855f7", // purple-500
                    },
                  ];

                  const chartConfig = {
                    hours: {
                      label: "ชั่วโมง",
                    },
                    Lecture: {
                      label: "Lecture",
                      color: "#fbbf24",
                    },
                    Lab: {
                      label: "Lab",
                      color: "#a855f7",
                    },
                  };

                  return (
                    <div className="flex flex-col items-center w-full">
                      {/* Semester Selector - Top Right */}
                      <div className="absolute top-4 right-4 z-10">
                        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                          <SelectTrigger className="w-[120px] bg-white text-gray-900 font-semibold shadow-md">
                            <SelectValue placeholder="เลือกภาค" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="ภาคต้น" className="text-gray-900">ภาคต้น</SelectItem>
                            <SelectItem value="ภาคปลาย" className="text-gray-900">ภาคปลาย</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-full h-[240px] flex items-center justify-center">
                        <ChartContainer
                          config={chartConfig}
                          className="w-[240px] h-[240px]"
                        >
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              dataKey="hours"
                              nameKey="type"
                              cx="50%"
                              cy="50%"
                              outerRadius={70}
                              label
                            />
                            <ChartLegend
                              content={<ChartLegendContent nameKey="type" />}
                              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                            />
                          </PieChart>
                        </ChartContainer>
                      </div>

                      {/* Summary Cards */}
                      <div className="mt-4 w-full grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg border-2 border-yellow-400">
                          <p className="text-xs text-gray-600 font-medium">Lecture</p>
                          <p className="text-xl font-bold text-yellow-600">
                            {semesterData.totalLectureHours}
                          </p>
                          <p className="text-xs text-gray-500">
                            / {semesterData.maxLectureHours} ชั่วโมง
                          </p>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-yellow-500 h-1.5 rounded-full"
                              style={{
                                width: `${(semesterData.totalLectureHours / semesterData.maxLectureHours) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border-2 border-purple-500">
                          <p className="text-xs text-gray-600 font-medium">Lab</p>
                          <p className="text-xl font-bold text-purple-600">
                            {semesterData.totalLabHours}
                          </p>
                          <p className="text-xs text-gray-500">
                            / {semesterData.maxLabHours} ชั่วโมง
                          </p>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-purple-500 h-1.5 rounded-full"
                              style={{
                                width: `${(semesterData.totalLabHours / semesterData.maxLabHours) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">ไม่มีข้อมูลกราฟ</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ==================== Summary Cards Section ==================== */}
        {/* TODO: ส่วนนี้จะทำภายหลัง - Summary Cards แสดงข้อมูลสรุป Lecture, Lab, และรวมทั้งหมด */}
        {/* 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-50">
              <h3 className="text-lg font-semibold text-blue-900">
                สอนภาคทฤษฎี
              </h3>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนชั่วโมง:</span>
                  <span className="font-semibold">
                    {data.summary.lecture.totalHours.toLocaleString()} ชม.
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนเงิน:</span>
                  <span className="font-semibold text-blue-600">
                    ฿{data.summary.lecture.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนฟอร์ม:</span>
                  <span className="font-semibold">
                    {data.summary.lecture.formsCount} ฟอร์ม
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="bg-purple-50">
              <h3 className="text-lg font-semibold text-purple-900">
                สอนภาคปฏิบัติ
              </h3>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนชั่วโมง:</span>
                  <span className="font-semibold">
                    {data.summary.lab.totalHours.toLocaleString()} ชม.
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนเงิน:</span>
                  <span className="font-semibold text-purple-600">
                    ฿{data.summary.lab.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนฟอร์ม:</span>
                  <span className="font-semibold">
                    {data.summary.lab.formsCount} ฟอร์ม
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="bg-green-50">
              <h3 className="text-lg font-semibold text-green-900">รวมทั้งหมด</h3>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนชั่วโมง:</span>
                  <span className="font-semibold">
                    {data.summary.grand.totalHours.toLocaleString()} ชม.
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนเงิน:</span>
                  <span className="font-semibold text-green-600 text-xl">
                    ฿{data.summary.grand.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวนฟอร์ม:</span>
                  <span className="font-semibold">
                    {data.summary.grand.formsCount} ฟอร์ม
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        */}

        {/* ==================== Approved Forms Table Section ==================== */}
        {/* Approved Forms Table */}
        <Card className="shadow-lg overflow-hidden rounded-xl bg-transparent p-0 border-none">
          <CardHeader className="bg-gradient-to-r from-[#006B42] to-[#02BC77] p-6">
            <h3 className="text-xl font-semibold text-white">
              ฟอร์มที่อนุมัติแล้ว
            </h3>
          </CardHeader>
          <CardContent className="p-6">
            {/* Program Selector Tabs with Month and Year Selectors */}
            <div className="mt-4 flex items-center justify-between border-b border-gray-300">
              {/* Left side - Program Tabs */}
              <div className="flex gap-8">
                <button
                  onClick={() => setSelectedProgram("ภาคปกติ")}
                  className={`pb-2 text-base font-semibold transition-colors ${
                    selectedProgram === "ภาคปกติ"
                      ? "border-b-[6px] border-[#02BC77] text-[#02BC77]"
                      : "text-[#71717A]"
                  }`}
                >
                  ภาคปกติ
                </button>
                <button
                  onClick={() => setSelectedProgram("ภาคพิเศษ")}
                  className={`pb-2 text-base font-semibold transition-colors ${
                    selectedProgram === "ภาคพิเศษ"
                      ? "border-b-[6px] border-[#02BC77] text-[#02BC77]"
                      : "text-[#71717A]"
                  }`}
                >
                  ภาคพิเศษ
                </button>
              </div>

              {/* Right side - Month and Year Selector */}
              <div className="flex items-center gap-4 pb-2">
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
                <Select value={selectedDisplayYear} onValueChange={setSelectedDisplayYear}>
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

            {filteredForms.length > 0 ? (
              <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-[#006B42] to-[#02BC77]">
                      
                      <TableHead className="text-white py-3 px-4 font-semibold">
                        ประเภท
                      </TableHead>
                      <TableHead className="text-white py-3 px-4 font-semibold">
                        รหัสวิชา
                      </TableHead>
                      <TableHead className="text-white py-3 px-4 font-semibold">
                        รายวิชา
                      </TableHead>
                      <TableHead className="text-white py-3 px-4 font-semibold">
                        ประจำเดือน
                      </TableHead>
                      <TableHead className="text-white py-3 px-4 font-semibold">
                        ภาคเรียน
                      </TableHead>
                      <TableHead className="text-white py-3 px-4 font-semibold">
                        วันที่ส่ง
                      </TableHead>
                      <TableHead className="text-white py-3 px-4 font-semibold">
                        วันที่อนุมัติ
                      </TableHead>
                      <TableHead className="text-white py-3 px-4 font-semibold text-right">
                        จำนวนเงินที่เบิก
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredForms.map((form: Form, index: number) => (
                      <TableRow
                        key={form.id}
                        className={`transition-colors ${
                          index % 2 === 0 ? 'bg-green-50/50' : 'bg-white'
                        } hover:bg-green-100`}
                      >
                        <TableCell className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            form.section === 'LAB' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {form.section}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4 font-medium text-gray-900">
                          {form.subjectId}
                        </TableCell>
                        <TableCell className="py-3 px-4">{form.subjectName}</TableCell>
                        <TableCell className="py-3 px-4">{form.month}</TableCell>
                        <TableCell className="py-3 px-4">
                          {form.semester}/{form.year}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {new Date(form.createdAt).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {new Date(form.updatedAt).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-right">
                          <span className="font-bold text-green-600 text-lg">
                            ฿{form.amount.toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 mt-6">
                <p className="text-gray-500">ไม่มีฟอร์มที่อนุมัติแล้วสำหรับ{selectedProgram}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetail;
