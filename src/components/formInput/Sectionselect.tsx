import { Card, CardContent } from "../ui/card";
import SpecialBadge from "./SpecialBadge";
import SectionBadge from "./SectionBadge";
import { Link } from "react-router";

const Sectionselect = ({ name }: { name: string }) => {
  const BadgeComponent = name === "ภาคปกติ" ? SectionBadge : SpecialBadge;
  const program = name === "ภาคปกติ" ? "REGULAR_PROGRAM" : "SPECIAL_PROGRAM";

  return (
    <div className="mb-4">
      <p className="font-bold">{name}</p>
      <Link to={`/form/new?program=${program}&section=LECTURE`}>
        <Card className="mt-2 h-16 w-full cursor-pointer border-0 shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100 hover:shadow-lg">
          <CardContent className="flex h-full items-center">
            <p>
              กรอกแบบฟอร์มการสอนหมู่บรรยาย <BadgeComponent />
            </p>
          </CardContent>
        </Card>
      </Link>
      <Link to={`/form/new?program=${program}&section=LAB`}>
        <Card className="mt-4 h-16 w-full cursor-pointer border-0 shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100 hover:shadow-lg">
          <CardContent className="flex h-full items-center">
            <p>
              กรอกแบบฟอร์มการสอนหมู่ปฏิบัติ <BadgeComponent />
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default Sectionselect;
