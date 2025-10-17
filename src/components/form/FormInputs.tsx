import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { UseFormRegister, FieldPath, FieldValues, FieldErrors } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: FieldPath<T>;
  type: string;
  placeholder: string;
  errors?: FieldErrors<T>;
  className?: string;
  label?: string;
  showLabel?: boolean;
};

const FormInputs = <T extends FieldValues>(props: FormInputProps<T>) => {
  const {
    register,
    name,
    type,
    placeholder,
    errors,
    className = "",
    label,
    showLabel = true,
  } = props;

  return (
    <div className="mb-4 max-w-[500px] w-full">
      {showLabel && (
        <Label
          htmlFor={name}
          className="block text-sm font-medium mb-2 capitalize"
        >
          {label || placeholder}
        </Label>
      )}
      <Input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`
          ${className}
          ${
            errors?.[name]
              ? "border-red-500 focus:border-red-600 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }
        `}
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
export default FormInputs;
