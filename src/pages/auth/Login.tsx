import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import FormInputs from "@/components/form/FormInputs";
import { login, type LoginResponse } from "@/api/auth/login";
import { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginFormInputs } from "@/utils/types";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const { register, handleSubmit } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setError(null);

    try {
      const result: LoginResponse = await login(data.email, data.password);
      console.log("Login successful:", result);

      // Store the access token in localStorage
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("user", JSON.stringify(result.user));

      // Redirect to dashboard or home page
      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.response?.status === 401) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else if (error.response?.status === 500) {
        setError("เกิดข้อผิดพลาดของเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง");
      } else {
        setError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen container">
      <div className="flex-2 pt-[150px]">
        <h1 className="font-bold text-5xl mb-3.5">เข้าสู่ระบบ</h1>
        <p className="text-2xl mb-10">
          สร้างบัญชีของคุณ{" "}
          <span className="underline cursor-pointer text-[#2797C7]">
            สร้างบัญชี
          </span>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInputs
            register={register}
            name="email"
            type="email"
            placeholder="Email"
            className="h-12 bg-[#F4F4F5] rounded-2xl mb-3"
          />
          <FormInputs
            register={register}
            name="password"
            type="password"
            placeholder="Password"
            className="h-12 bg-[#F4F4F5] rounded-2xl mb-6"
          />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#17C964] hover:bg-[#13b45a] disabled:bg-gray-400 disabled:cursor-not-allowed w-[500px] h-12 rounded-2xl text-black text-lg transition-colors cursor-pointer mb-6"
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>
        </form>
        <p className="text-[#2797C7] cursor-pointer">ลืมรหัสผ่าน?</p>
      </div>
      <div className="flex-1 bg-blue-300">Image</div>
    </div>
  );
};
export default Login;
