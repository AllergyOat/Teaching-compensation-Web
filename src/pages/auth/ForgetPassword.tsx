import { useState } from "react";
import EmailStep from "@/components/authForm/steps/EmailStep";
import OtpStep from "@/components/authForm/steps/OtpStep";
import NewPasswordStep from "@/components/authForm/steps/NewPasswordStep";
import { Card } from "@/components/ui/card";
import registerBG from "@/assets/images/registerBG.png";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${registerBG})` }}
    >
      <div className="bg-opacity-50 flex min-h-screen items-center justify-center p-4">
        <Card className="bg-opacity-90 w-full max-w-md rounded-2xl border-0 bg-white p-9 shadow-xl">
          {/* Progress Indicator */}
          <div>
            <div className="relative flex items-center justify-between">
              {/* Background Line */}
              <div className="absolute top-5 right-0 left-0 z-0 h-1 bg-gray-200"></div>

              {/* Active Progress Bar */}
              <div
                className="absolute top-5 left-0 z-0 h-1 bg-[#0BA678] transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>

              {/* Step 1 */}
              <div className="z-10 flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                    step >= 1
                      ? "bg-[#0BA678] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > 1 ? "✓" : "1"}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    step >= 1 ? "text-[#006B42]" : "text-gray-400"
                  }`}
                >
                  Email
                </span>
              </div>

              {/* Step 2 */}
              <div className="z-10 flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                    step >= 2
                      ? "bg-[#0BA678] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > 2 ? "✓" : "2"}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    step >= 2 ? "text-[#0BA678]" : "text-gray-400"
                  }`}
                >
                  Verify
                </span>
              </div>

              {/* Step 3 */}
              <div className="z-10 flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                    step >= 3
                      ? "bg-[#0BA678] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > 3 ? "✓" : "3"}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    step >= 3 ? "text-[#0BA678]" : "text-gray-400"
                  }`}
                >
                  Reset
                </span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <EmailStep
              onNext={(email) => {
                setEmail(email);
                setStep(2);
              }}
            />
          )}

          {step === 2 && (
            <OtpStep
              email={email}
              onNext={(otp) => {
                setOtp(otp);
                setStep(3);
              }}
            />
          )}

          {step === 3 && <NewPasswordStep email={email} otp={otp} />}
        </Card>
      </div>
    </div>
  );
};

export default ForgetPassword;
