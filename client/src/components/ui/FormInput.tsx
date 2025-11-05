"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "react-hook-form";

interface FormInputProps {
  label: string;
  name: string;
  register: any;
  type?: string;
  error?: FieldError;
}

export function FormInput({ label, name, register, type = "text", error }: FormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} type={type} {...register(name)} />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
