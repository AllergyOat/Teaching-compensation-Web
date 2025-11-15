import { useForm } from "react-hook-form";
import { forgetPassword } from "@/api/auth/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputs from "../FormInputs";
import Buttons from "../Buttons";
import { forgetPasswordSchema } from "@/utils/schemas";
import { Link } from "react-router";

interface EmailStepProps {
  onNext: (email: string) => void;
}

interface FormData {
  email: string;
}

export default function EmailStep({ onNext }: EmailStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await forgetPassword(data.email);
      onNext(data.email);
    } catch (err: any) {
      setError("root", {
        type: "server",
        message:
          err.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-bold">ลืมรหัสผ่าน</h2>
      <p className="font-semibold text-[#048C59]">
        กรอกอีเมลของคุณเพื่อรับรหัส OTP
      </p>

      <div className="mt-4">
        <FormInputs
          type="email"
          register={register}
          label="อีเมล"
          name="email"
          placeholder="your@email.com"
          className="h-12 w-full rounded-2xl border px-4 py-2"
          errors={errors}
        />
      </div>

      {errors.root && (
        <p className="mt-2 text-sm text-red-600">{errors.root.message}</p>
      )}

      <Buttons
        text="ส่งรหัส OTP"
        isPending={isSubmitting}
        className="mt-4 w-full rounded-xl bg-[#0BA678] py-2 text-white hover:bg-[#048C59]"
      />
      <Link to="/login">
        <p className="mb-4 mt-4 text-right text-sm ">
          จำรหัสผ่านได้? <span className="text-[#2797C7] font-semibold underline">เข้าสู่ระบบ</span>
        </p>
      </Link>
    </form>
  );
}
