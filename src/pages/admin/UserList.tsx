import emptyBoxImage from "@/assets/images/students.png";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAdminUsers, type Root } from "../../api/admin/teachers";
import { getAdminHomeData } from "../../api/admin/home";

const UserList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Root | null>(null);
  const [adminInfo, setAdminInfo] = useState<{ firstName: string; lastName: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Fetch both users list and admin info
        const [usersRes, adminRes] = await Promise.all([
          getAdminUsers(),
          getAdminHomeData()
        ]);
        setData(usersRes);
        setAdminInfo(adminRes.myInformation);
      } catch (e: any) {
        setErr(e?.message ?? "Fetch failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter users based on search query
  const filteredUsers = data?.users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      searchQuery === "" ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.id.toLowerCase().includes(searchLower) ||
      user.major?.toLowerCase().includes(searchLower) ||
      user.department?.toLowerCase().includes(searchLower)
    );
  }) || [];

  if (loading) return <div className="p-4">Loading…</div>;
  if (err) return <div className="p-4 text-red-600">Error: {err}</div>;
  if (!data) return <div className="p-4">No data</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-[#014D30] to-[#02BC77] pb-20 pt-8 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-10">
          <div className="flex flex-1 flex-col">
            <h1 className="text-4xl font-bold">ข้อมูลอาจารย์ผู้สอน</h1>
            <p className="mt-2 text-lg opacity-90">
              ผู้ดูแล : {adminInfo?.firstName} {adminInfo?.lastName}
            </p>
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

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-10 pt-8">
        {/* Title */}
        <h2 className="text-xl font-bold text-[#0E8240] mb-4">ข้อมูลผู้ใช้</h2>
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white h-12 text-base"
            />
          </div>
        </div>

        {/* User Cards Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-10">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="bg-[#F0F9F6] border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Name Section */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#006B42]">
                      {user.firstName} {user.lastName}
                    </h3>
                  </div>

                  {/* Info Grid */}
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="text-gray-600 w-32">สังกัดภาควิชา :</span>
                      <span className="font-medium text-gray-900">{user.department || '-'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">คณะ :</span>
                      <span className="font-medium text-gray-900">{user.faculty || '-'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">สาขา :</span>
                      <span className="font-medium text-gray-900">{user.major || '-'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">ตำแหน่ง :</span>
                      <span className="font-medium text-gray-900">{user.position || '-'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-32">ระดับการศึกษา :</span>
                      <span className="font-medium text-gray-900">{user.degree || '-'}</span>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => navigate(`/admin/user/${user.id}`)}
                      className="bg-white px-6 py-2 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg border border-gray-200"
                    >
                      ดูข้อมูล
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserList;