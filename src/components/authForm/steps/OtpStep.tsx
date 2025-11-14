import { useForm } from "react-hook-form";
import { verifyOtp } from "@/api/auth/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/utils/schemas";
import FormOTPInput from "../FormOTPInputs";
import { useEffect } from "react";

interface OtpStepProps {
  email: string;
  onNext: (otp: string) => void;
}

interface FormData {
  otp: string;
}

export default function OtpStep({ email, onNext }: OtpStepProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = watch("otp");

  const onSubmit = async (data: FormData) => {
    try {
      await verifyOtp(email, data.otp);
      onNext(data.otp);
    } catch (err: any) {
      setError("root", {
        type: "manual",
        message: err.response?.data?.message || "Invalid OTP",
      });
    }
  };

  useEffect(() => {
    if (otpValue && otpValue.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [otpValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold">ใส่รหัส OTP</h2>
      <p className="font-semibold text-[#048C59]">รหัสได้ถูกส่งไปยัง {email}</p>

      <div className="mt-4">
        <FormOTPInput
          control={control}
          name="otp"
          label="รหัส OTP"
          errors={errors}
          length={6}
          className="h-12 w-[67px] border-2"
        />
      </div>
      <div>
        <p className="text-gray-500 text-sm">กรุณากรอกรหัสของคุณภายใน 10 นาที</p>
      </div>
      {errors.root && (
        <p className="text-sm text-red-500">{errors.root.message}</p>
      )}

      {isSubmitting && (
        <p className="text-center text-gray-600">กำลังตรวจสอบ...</p>
      )}
    </form>
  );
}
