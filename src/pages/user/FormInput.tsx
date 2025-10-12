import documentsImg from "@/assets/images/documents.png";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSearchParams } from "react-router";
import {
  translateProgram,
  translateSection,
} from "@/utils/programSectionUtils";
import type { FormData } from "@/utils/types";
import { FormInfoSection } from "@/components/formInput/FormInfoSection";
import { LectureScheduleEditor } from "@/components/formInput/LectureScheduleEditor";

const FormInput = () => {
  const [searchParams] = useSearchParams();
  const program = searchParams.get("program") || "";
  const section = searchParams.get("section") || "";
  const programThai = translateProgram(program);
  const sectionThai = translateSection(section);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    form: {
      program: program,
      section: section,
      month: "",
      semester: "",
      year: new Date().getFullYear() + 543, // Buddhist year
      subjectId: "",
      subjectName: "",
    },
    formScheduleDetails: [
      {
        lectureId: "",
        schedules: [
          {
            date: "",
            time: "",
            totalHour: 0,
            topic: "",
            room: "",
            note: null,
          },
        ],
      },
    ],
  });

  const updateFormField = (
    field: keyof FormData["form"],
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", JSON.stringify(formData, null, 2));
    alert("ส่งแบบฟอร์มสำเร็จ!");
    // try {
    //   const accessToken = localStorage.getItem("accessToken");
    //   if (!accessToken) {
    //     alert("กรุณาเข้าสู่ระบบก่อนส่งแบบฟอร์ม");
    //     return;
    //   }

    //   const response = await fetch(
    //     "http://localhost:3000/api/forms/create-form",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //       body: JSON.stringify(formData),
    //     },
    //   );

    //   if (!response.ok) {
    //     if (response.status === 401) {
    //       alert("เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่");
    //       localStorage.removeItem("accessToken");
    //       localStorage.removeItem("user");
    //       // Optionally redirect to login page
    //       return;
    //     }
    //     throw new Error("เกิดข้อผิดพลาดในการส่งแบบฟอร์ม");
    //   }

    //   alert("ส่งแบบฟอร์มสำเร็จ!");
    // } catch (error) {
    //   alert("ไม่สามารถส่งแบบฟอร์มได้");
    //   console.error(error);
    // }
  };

  return (
    <div>
      <header>
        <div className="flex items-center gap-4 bg-[#02BC77] p-4 pl-10 text-3xl font-bold text-white shadow-md">
          <img src={documentsImg} alt="Documents" className="h-28 w-20" />
          <h1>
            แบบฟอร์มการสอน{sectionThai} {programThai}
          </h1>
        </div>
      </header>
      <main className="flex flex-col items-center justify-start">
        <div className="mt-4 w-10/12">
          <div>Breadcrumb</div>

          {/* Form Information Section */}
          <FormInfoSection
            form={formData.form}
            updateFormField={updateFormField}
          />
          <LectureScheduleEditor
            value={formData.formScheduleDetails}
            onChange={(next) =>
              setFormData((prev) => ({
                ...prev,
                formScheduleDetails: next as FormData["formScheduleDetails"],
              }))
            }
          />

          <div className="mt-8 mb-8 flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-green-600 px-8 py-2 text-white hover:bg-green-700"
            >
              ส่งแบบฟอร์ม
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
export default FormInput;
