const Home = () => {
  return (
    <div className="m-[50px]">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="border-2 border-gray-300 grid grid-cols-[65%_35%] gap-4 p-4 mt-4">
        <div>
          <div className="h-65 mb-6 bg-green-200">สวัสดี คุณ.....</div>
          <div className="grid grid-cols-2 gap-5 h-60">
            <div className="bg-gray-200">วิชาที่ส่งแล้ว</div>
            <div className="bg-gray-200">ชั่วโมงการสอนสุทธิ</div>
          </div>
        </div>
        <div className="flex flex-col gap-5 h-full">
          <div className="bg-red-200 h-13">Dashboard & setting</div>
          <div className="bg-blue-200 h-full">//show dashboard or setting detail</div>
        </div>
      </div>
    </div>
  );
};
export default Home;
