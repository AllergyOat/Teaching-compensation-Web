import emptyBoxImage from "@/assets/images/students.png";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
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
        {/* Add your content here */}
      </div>
    </div>
  );
};
export default Home;
