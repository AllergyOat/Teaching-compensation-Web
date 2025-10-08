import { useForm } from "react-hook-form";
import FormInputs from "@/components/form/FormInputs";
import { login, type LoginResponse } from "@/api/auth/login";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginFormInputs } from "@/utils/types";
import { loginSchema } from "@/utils/schemas";
import Buttons from "@/components/form/Buttons";
import { useState } from "react";

const Login = () => {
  const { register, handleSubmit, formState } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const { errors, isSubmitting } = formState;
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loginSubmit = async (data: LoginFormInputs) => {
    try {
      setLoginError(null);

      const { accessToken, user }: LoginResponse = await login(
        data.email,
        data.password,
      );

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Navigate to home page on success
      navigate("/home");
    } catch (error: any) {
      console.error("Login failed:", error);

      if (error.response?.status === 401) {
        setLoginError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else if (error.response?.status === 500) {
        setLoginError("เกิดข้อผิดพลาดของเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง");
      } else if (error.message?.includes("Network Error")) {
        setLoginError(
          "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
        );
      } else {
        setLoginError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-2 flex-col items-center pt-[150px]">
        <div>
          <h1 className="mb-3.5 text-5xl font-bold">เข้าสู่ระบบ</h1>
          <p className="mb-10 text-2xl">
            สร้างบัญชีของคุณ{" "}
            <Link to="/register">
              <span className="text-[#2797C7] underline">สร้างบัญชี</span>
            </Link>
          </p>
          <form onSubmit={handleSubmit(loginSubmit)}>
            <FormInputs
              register={register}
              name="email"
              type="email"
              placeholder="Email"
              errors={errors}
              className="h-12 w-full rounded-xl border-1 bg-[#F4F4F5] px-4 py-3 transition-all duration-200 placeholder:text-gray-700"
            />
            <FormInputs
              register={register}
              name="password"
              type="password"
              placeholder="Password"
              errors={errors}
              className="h-12 w-full rounded-xl border-1 bg-[#F4F4F5] px-4 py-3 transition-all duration-200 placeholder:text-gray-700"
            />
            <Buttons
              text="เข้าสู่ระบบ"
              isPending={isSubmitting}
              className="mb-6 h-12 w-[500px] cursor-pointer rounded-2xl bg-[#17C964] text-lg text-black transition-colors hover:bg-[#13b45a]"
            />
          </form>
          <p className="cursor-pointer text-[#2797C7]">ลืมรหัสผ่าน?</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-start justify-center bg-blue-300">
        <div>Image</div>
      </div>
    </div>
  );
};
export default Login;
