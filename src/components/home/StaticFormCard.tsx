import { Card } from "../ui/card";

type StaticFormCardProps = {
  total: number;
  description: string;
  graphData: string;
};

const StaticFormCard = (props: StaticFormCardProps) => {
  const { total, description, graphData } = props;
  return (
    <Card className="bg-white border-0 shadow-md flex items-center justify-center">
      <div className="grid grid-cols-[1fr_2fr_1fr] w-full h-full">
        <div className="flex items-center justify-center font-bold text-6xl pl-5">
          {total}
        </div>
        <div className="flex items-center justify-center text-left pl-5 font-bold text-lg ">
          {description}
        </div>
        <div className="flex items-center justify-center 0">{graphData}</div>
      </div>
    </Card>
  );
};
export default StaticFormCard;
