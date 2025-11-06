import { useForm } from "react-hook-form";
import FormInputs from "@/components/form/FormInputs";
import { login, type LoginResponse } from "@/api/auth/login";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginFormInputs } from "@/utils/types";
import { loginSchema } from "@/utils/schemas";
import Buttons from "@/components/form/Buttons";
import { useState } from "react";
import dashbordImg from "@/assets/images/dashboard.png";

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

      console.log("Login Response - User:", user);
      console.log("User Role:", user.role);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Navigate based on user role
      if (user.role === "ADMIN" || user.role === "MAJOR_ADMIN") {
        console.log("Navigating to /admin");
        navigate("/admin");
      } else {
        console.log("Navigating to /home");
        navigate("/home");
      }
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
    <>
      {/* Desktop Layout */}
      <div className="flex h-screen bg-[#F7F7F7]">
        {/* Left side - Image */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl px-8">
            <img
              src={dashbordImg}
              alt="Dashboard"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex flex-1 flex-col items-center justify-center rounded-3xl bg-white shadow-xl">
          <div className="w-full max-w-[500px] px-8">
            <h1 className="mb-3 text-5xl font-bold">ยินดีต้อนรับสู่</h1>
            <p className="mb-10 text-2xl font-semibold text-[#048C59]">
              ระบบเบิกจ่ายค่าสอนพิเศษ
            </p>

            {/* Display login error */}
            {loginError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit(loginSubmit)}>
              <FormInputs
                register={register}
                name="email"
                type="email"
                placeholder="อีเมล"
                errors={errors}
                className="h-12 w-full rounded-xl border-1 bg-[#F4F4F5] px-4 py-3 transition-all duration-200 placeholder:text-gray-700"
              />
              <FormInputs
                register={register}
                name="password"
                type="password"
                placeholder="รหัสผ่าน"
                errors={errors}
                className="h-12 w-full rounded-xl border-1 bg-[#F4F4F5] px-4 py-3 transition-all duration-200 placeholder:text-gray-700"
              />
              <Buttons
                text="เข้าสู่ระบบ"
                isPending={isSubmitting}
                className="mt-4 mb-6 h-12 w-full cursor-pointer rounded-2xl bg-[#17C964] text-lg font-bold text-white transition-colors hover:bg-[#13b45a]"
              />
            </form>
            <p className="cursor-pointer text-right text-[#2797C7]">
              ลืมรหัสผ่าน?
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
