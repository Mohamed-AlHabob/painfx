import React from "react";
import {
  Controller,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Control,
  RegisterOptions,
} from "react-hook-form";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

type FormGeneratorProps = {
  name: string;
  label?: string;
  type?: "text" | "email" | "textarea" | "password" | "number" | "date" | "select";
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  register?: UseFormRegister<any>;
  errors: FieldErrors<FieldValues>;
  control?: Control<any>;
  defaultValue?: unknown;
  rules?: RegisterOptions<FieldValues>;
  options?: { value: string; label: string }[];
};

const FormGenerator: React.FC<FormGeneratorProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  disabled,
  rows = 4,
  register,
  errors,
  control,
  defaultValue = "",
  rules,
  options,
}) => {
  const renderErrorMessage = () => {
    const error = errors[name]?.message;
    if (typeof error === "string") {
      return (
        <p className="text-red-400 mt-2">
          {error === "Required" ? "This field is required" : error}
        </p>
      );
    }
    return null;
  };

  return (
    <Label className="flex flex-col gap-3" htmlFor={name}>
      {label && <span>{label}</span>}
      {type === "textarea" ? (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          rules={rules}
          render={({ field }) => (
            <Textarea
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              {...field}
            />
          )}
        />
      ) : type === "select" ? (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          rules={rules}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      ) : (
        <Input
          id={name}
          type={type}
           className="dark:bg-themeBlack  text-themeTextGray bg-gray-200"
          placeholder={type === "date" ? "YYYY-MM-DD" : placeholder}
          disabled={disabled}
          defaultValue={defaultValue as string}
          {...(register && register(name, rules))}
        />
      )}
      {renderErrorMessage()}
    </Label>
  );
};

export default FormGenerator;
