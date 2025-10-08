import { Card } from "../ui/card";

interface SchedulesCardProps {
  subjectId: string;
  sectionId: string;
  subjectName: string;
  section: string;
  room: string;
  program: string;
  sectionColorClass?: string;
}

const SchedulesCard = (props: SchedulesCardProps) => {
  const {
    subjectId,
    sectionId,
    subjectName,
    section,
    room,
    program,
    sectionColorClass,
  } = props;
  return (
    <Card className="grid h-37 grid-cols-[2fr_1fr] border-0 shadow-md">
      <div className="flex flex-col justify-center gap-y-4 pl-8 font-bold">
        <div>
          {subjectId} <span className="font-normal">หมู่</span>{" "}
          <span className="text-[#02BC77]">{sectionId}</span>
        </div>
        <div>{subjectName}</div>
      </div>
      <div className="flex flex-col justify-start text-center font-bold">
        <div>
          <div
            className={`inline-block rounded-full px-4 py-1 text-sm ${sectionColorClass || "bg-cyan-500 text-white"}`}
          >
            {section}
          </div>
        </div>
        <div className="mt-5">
          ห้อง: <span className="font-normal">{room}</span>
        </div>
        <div>
          ภาค: <span className="font-normal">{program}</span>
        </div>
      </div>
    </Card>
  );
};
export default SchedulesCard;
