import emptyBoxImage from "@/assets/images/students.png";

const UserList = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-[#014D30] to-[#02BC77] pb-20 pt-8 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-10">
          <div className="flex flex-1 flex-col">
            <h1 className="text-4xl font-bold">ข้อมูลอาจารย์ผู้สอน</h1>
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
    </div>
  )
}
export default UserList