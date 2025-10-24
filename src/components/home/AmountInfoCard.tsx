import { Card } from "../ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";
import { Pie, PieChart, Cell } from "recharts";

// Custom Label Component - แสดงใน Pie Chart
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      className="font-bold text-sm"
    >
      ฿{value.toLocaleString()}
    </text>
  );
};

const AmountInfoCard = ({ labAmount, lectureAmount}: { labAmount: number; lectureAmount: number }) => {
  // เตรียมข้อมูลสำหรับ Pie Chart
  const pieChartData = [
    {
      type: "Lecture",
      amount: lectureAmount,
      fill: "#fbbf24", // สีเหลือง
    },
    {
      type: "Lab",
      amount: labAmount,
      fill: "#a855f7", // สีม่วง
    },
  ];

  console.log("AmountInfoCard data:", { lectureAmount, labAmount, pieChartData });

  const chartConfig = {
    amount: {
      label: "จำนวนเงิน",
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
    <Card className="h-full border-0 bg-[#F0F9F6] shadow-md flex flex-col items-center justify-center p-4">
      <div className="w-full flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="w-[280px] h-[280px]"
        >
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="amount"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={renderCustomLabel}
              labelLine={false}
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </div>
      
      {/* แสดงข้อมูลตัวเลข */}
      <div className="mt-2 text-center">
        <div className="text-base font-bold text-[#03A96B]">
          วิชา lecture : {lectureAmount.toLocaleString()} บาท
        </div>
        <div className="text-base font-bold text-[#03A96B]">
          วิชา lab : {labAmount.toLocaleString()} บาท
        </div>
      </div>
    </Card>
  );
};

export default AmountInfoCard;