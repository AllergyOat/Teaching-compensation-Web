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
        data.password
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
      } else if (error.message?.includes('Network Error')) {
        setLoginError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
      } else {
        setLoginError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  return (
    <div className="flex h-screen container">
      <div className="flex-2 pt-[150px]">
        <h1 className="font-bold text-5xl mb-3.5">เข้าสู่ระบบ</h1>
        <p className="text-2xl mb-10">
          สร้างบัญชีของคุณ{" "}
          <Link to="/register">
            <span className="underline text-[#2797C7]">สร้างบัญชี</span>
          </Link>
        </p>
        <form onSubmit={handleSubmit(loginSubmit)}>
          <FormInputs
            register={register}
            name="email"
            type="email"
            placeholder="Email"
            errors={errors}
            className="w-full px-4 py-3 rounded-xl border-1 bg-[#F4F4F5] h-12 transition-all duration-200 placeholder:text-gray-700"
          />
          <FormInputs
            register={register}
            name="password"
            type="password"
            placeholder="Password"
            errors={errors}
            className="w-full px-4 py-3 rounded-xl border-1 bg-[#F4F4F5] h-12 transition-all duration-200 placeholder:text-gray-700"
          />
          <Buttons text="เข้าสู่ระบบ" isPending={isSubmitting} className="bg-[#17C964] hover:bg-[#13b45a] w-[500px] h-12 rounded-2xl text-black text-lg transition-colors cursor-pointer mb-6" />

        </form>
        <p className="text-[#2797C7] cursor-pointer">ลืมรหัสผ่าน?</p>
      </div>
      <div className="flex-1 bg-blue-300">Image</div>
    </div>
  );
};
export default Login;
