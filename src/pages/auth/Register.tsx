import { Card } from "@/components/ui/card";
import registerBG from "../../assets/images/registerBG.png";
import { Link, useNavigate } from "react-router";
import FormInputs from "@/components/form/FormInputs";
import type { RegisterFormInputs } from "@/utils/types";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Buttons from "@/components/form/Buttons";
import { registerAPI, type LoginResponse } from "@/api/auth/login";

const Register = () => {
  const { register, handleSubmit, formState } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const { errors, isSubmitting } = formState;
  const navigate = useNavigate();

  const registerSubmit = async (data: RegisterFormInputs) => {
    const { accessToken, user }: LoginResponse = await registerAPI(
      data.email,
      data.password
    );

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    navigate("/");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${registerBG})` }}
    >
      <div className="min-h-screen bg-opacity-50 flex items-center justify-center">
        <Card className="flex flex-col items-center w-[550px] h-[600px] p-9 bg-opacity-90 bg-white border-0 shadow-xl">
          <div className="space-y-1 text-center mt-4">
            <h1 className="text-4xl font-bold text-center">สร้างบัญชีของคุณ</h1>
            <h2 className="mt-2.5">
              มีบัญชีอยู่แล้ว?{" "}
              <Link to="/login">
                <span className="text-[#2797C7]">เข้าสู่ระบบ</span>
              </Link>
            </h2>
          </div>
          {/* Registration form fields go here */}
          <form onSubmit={handleSubmit(registerSubmit)}>
            <FormInputs
              register={register}
              name="email"
              type="email"
              placeholder="Email"
              errors={errors}
              className="w-[450px] px-4 py-3 rounded-xl border-0 bg-[#F4F4F5] h-13 transition-all duration-200 placeholder:text-gray-700"
            />
            <FormInputs
              register={register}
              name="password"
              type="password"
              placeholder="Password"
              errors={errors}
              className="w-[450px] px-4 py-3 rounded-xl border-0 bg-[#F4F4F5] h-13 transition-all duration-200 placeholder:text-gray-700"
            />
            <FormInputs
              register={register}
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              errors={errors}
              className="w-[450px] px-4 py-3 rounded-xl border-0 bg-[#F4F4F5] h-13 transition-all duration-200 placeholder:text-gray-700"
            />
            <Buttons
              text="สร้างบัญชี"
              isPending={isSubmitting}
              className="bg-[#17C964] hover:bg-[#13b45a] w-[450px] h-12 rounded-2xl text-black text-lg transition-colors cursor-pointer mt-5"
            />
          </form>
        </Card>
      </div>
    </div>
  );
};
export default Register;
