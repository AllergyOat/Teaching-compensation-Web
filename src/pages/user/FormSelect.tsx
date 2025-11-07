import Sectionselect from "@/components/formInput/Sectionselect";

const Form = () => {
  return (
    <div className="mt-5 flex h-full justify-center">
      <div className="w-full max-w-4xl px-[50px] py-[50px]">
        <div className="mb-6">
          <h2 className="text-lg font-bold">เลือกประเภทแบบฟอร์ม</h2>
        </div>
        <Sectionselect name ="ภาคปกติ" />
        <Sectionselect name ="ภาคพิเศษ" />
      </div>
    </div>
  );
};
export default Form;
