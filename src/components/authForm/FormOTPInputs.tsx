import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "../ui/label";
import type { Control, FieldPath, FieldValues, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";

type FormOTPInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  errors?: FieldErrors<T>;
  className?: string;
  containerClassName?: string;
  label?: string;
  showLabel?: boolean;
  length?: number;
};

const FormOTPInput = <T extends FieldValues>(props: FormOTPInputProps<T>) => {
  const {
    control,
    name,
    errors,
    className = "",
    containerClassName = "",
    label,
    showLabel = true,
    length = 6,
  } = props;

  return (
    <div className={`mb-4 max-w-[500px] w-full ${containerClassName}`}>
      {showLabel && (
        <Label
          htmlFor={name}
          className="block text-sm font-medium mb-2 capitalize"
        >
          {label || name}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <InputOTP
            maxLength={length}
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
          >
            <InputOTPGroup>
              {Array.from({ length }).map((_, index) => (
                <InputOTPSlot 
                  key={index} 
                  index={index}
                  className={`
                    ${className}
                    ${
                      errors?.[name]
                        ? "border-red-500 focus:border-red-600"
                        : ""
                    }
                  `}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        )}
      />
      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {typeof errors[name]?.message === "string" ? errors[name]?.message : ""}
        </p>
      )}
    </div>
  );
};

export default FormOTPInput;