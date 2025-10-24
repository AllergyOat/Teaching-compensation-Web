import { Card } from "../ui/card"

const AmountInfoCard = ({ labAmount, lectureAmount}: { labAmount: number; lectureAmount: number }) => {
  return (
    <Card className="h-full border-0 bg-[#F0F9F6] shadow-md flex items-center justify-center">
      <div className="text-2xl font-bold text-[#03A96B]">
        {`วิชา lecture : ${lectureAmount.toLocaleString()} บาท`} <br />
        {`วิชา lab : ${labAmount.toLocaleString()} บาท`}
      </div>
    </Card>
  )
}
export default AmountInfoCard