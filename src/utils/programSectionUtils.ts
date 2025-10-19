export type ProgramType = "REGULAR_PROGRAM" | "SPECIAL_PROGRAM";

export const translateProgram = (program: string): string => {
  switch (program) {
    case "REGULAR_PROGRAM":
      return "ภาคปกติ";
    case "SPECIAL_PROGRAM":
      return "ภาคพิเศษ";
    default:
      return program;
  }
};

export const translateSection = (section: string): string => {
  switch (section) {
    case "LECTURE":
      return "บรรยาย";
    case "LAB":
      return "ปฏิบัติ";
    default:
      return section;
  }
};

export const getSectionColor = (section: string): string => {
  switch (section) {
    case "LECTURE":
      return "bg-[#2797C7] text-white";
    case "LAB":
      return "bg-[#C76427] text-white";
    default:
      return "bg-gray-100";
  }
};

export const thaiMonths = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
] as const;
