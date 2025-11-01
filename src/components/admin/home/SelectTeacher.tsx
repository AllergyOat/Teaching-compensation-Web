import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Teacher {
  userId: string;
  userName: string;
  formCount: number;
}

interface SelectTeacherProps {
  teachers: Teacher[];
  selectedTeacher: string;
  onTeacherChange: (teacherId: string) => void;
}

const SelectTeacher = ({ teachers, selectedTeacher, onTeacherChange }: SelectTeacherProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">อาจารย์:</span>
      <Select value={selectedTeacher} onValueChange={onTeacherChange}>
        <SelectTrigger className="w-[300px] bg-white">
          <SelectValue placeholder="เลือกอาจารย์" />
        </SelectTrigger>
        <SelectContent className="bg-white max-h-[300px]">
          <SelectItem value="ทั้งหมด">ทั้งหมด</SelectItem>
          {teachers.map((teacher) => (
            <SelectItem key={teacher.userId} value={teacher.userId}>
              {teacher.userName} 
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectTeacher;