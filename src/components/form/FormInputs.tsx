import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { LoginFormInputs } from "@/utils/types";
import type { UseFormRegister } from "react-hook-form";

type FormInputProps = {
  register: UseFormRegister<LoginFormInputs>;
  name: keyof LoginFormInputs;
  type: string;
  placeholder: string;
  className?: string;
};

const FormInputs = (props: FormInputProps) => {
  const { register, name, type, placeholder, className } = props;
  return (
    <div className="mb-4 max-w-[500px]">
      <Label htmlFor={name} className="capitalize mb-2">
        {name}
      </Label>
      <Input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
};
export default FormInputs;
