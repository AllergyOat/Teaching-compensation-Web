import { Card } from "../ui/card";

type StaticFormCardProps = {
  total: number;
  description: string;
  graphData: number;
  maxValue?: number;
};

const StaticFormCard = (props: StaticFormCardProps) => {
  const { total, description, graphData, maxValue = 100 } = props;
  
  // คำนวณเปอร์เซ็นต์
  const percentage = Math.min((graphData / maxValue) * 100, 100);
  const circumference = 2 * Math.PI * 36; // radius = 36
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="bg-white border-0 shadow-md p-4 md:p-6 lg:p-10">
      <div className="flex items-center justify-between">
        {/* Left side - Number and description */}
        <div className="flex items-center gap-2 md:gap-4">
          <h2 className="text-3xl md:text-4xl xl:text-6xl font-bold text-gray-900">{total}</h2>
          <p className="text-sm md:text-base xl:text-xl text-gray-800 font-semibold leading-tight">
            {description}
          </p>
        </div>
        
        {/* Right side - Circular Progress */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative h-20 w-20 md:h-28 md:w-28">
            {/* Shadow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-100/50 to-green-50/30 blur-sm"></div>
            
            <svg className="relative h-full w-full -rotate-90 transform">
              {/* Background circle with gradient */}
              <defs>
                <linearGradient id={`gradient-${total}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#02BC77" />
                  <stop offset="100%" stopColor="#048C59" />
                </linearGradient>
              </defs>
              
              {/* Background circle */}
              <circle
                cx="56"
                cy="56"
                r="36"
                stroke="#E8F5F0"
                strokeWidth="14"
                fill="none"
              />
              
              {/* Progress circle with gradient */}
              <circle
                cx="56"
                cy="56"
                r="36"
                stroke={`url(#gradient-${total})`}
                strokeWidth="14"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-in-out"
                style={{ filter: "drop-shadow(0 2px 4px rgba(2, 188, 119, 0.3))" }}
              />
            </svg>
          </div>
          {/* <span className="text-xs font-medium text-gray-500">graph</span> */}
        </div>
      </div>
    </Card>
  );
};
export default StaticFormCard;
