import { useForm } from "react-hook-form";
import { resetPassword } from "@/api/auth/auth";
import { useNavigate } from "react-router";
import FormInputs from "../FormInputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { newPasswordSchema } from "@/utils/schemas";
import Buttons from "../Buttons";

interface NewPasswordStepProps {
  email: string;
  otp: string;
}

type FormData = z.infer<typeof newPasswordSchema>;

export default function NewPasswordStep({ email, otp }: NewPasswordStepProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(newPasswordSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword(email, otp, data.newPassword);

      alert("Password reset successfully!");
      navigate("/login");
    } catch (err: any) {
      setError("root", {
        type: "manual",
        message: err.response?.data?.message || "Failed to reset password",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold">รีเซ็ตรหัสผ่าน</h2>
      <p className="font-semibold text-[#048C59]">
        กรุณากรอกรหัสผ่านใหม่ของคุณ
      </p>

      <div className="mt-4">
        <FormInputs
          label="รหัสผ่านใหม่"
          type="password"
          placeholder="••••••••"
          register={register}
          name="newPassword"
          className="h-12 w-full rounded-2xl border px-4 py-2"
          errors={errors}
        />

        <FormInputs
          label="ยืนยันรหัสผ่าน"
          type="password"
          placeholder="••••••••"
          register={register}
          name="confirmPassword"
          className="h-12 w-full rounded-2xl border px-4 py-2"
          errors={errors}
        />
      </div>

      {errors.root && <p className="text-red-500">{errors.root.message}</p>}

      <Buttons
        text="รีเซ็ตรหัสผ่าน"
        isPending={isSubmitting}
        className="mt-4 w-full rounded-xl bg-[#0BA678] py-2 text-white hover:bg-[#048C59]"
      />
    </form>
  );
}
