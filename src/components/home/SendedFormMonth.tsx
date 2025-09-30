import { Card, CardTitle, CardContent } from "../ui/card";

const SendedFormMonth = () => {
  return (
    <Card className="bg-[#F0F9F6] h-full shadow-md border-0 flex items-center">
      <CardTitle className="text-3xl">เดือนที่ทำการส่งเอกสาร</CardTitle>
      <CardContent>(map month) (-)</CardContent>
    </Card>
  );
};
export default SendedFormMonth;
