"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/services/api";
import { FormInput } from "@/components/ui/FormInput";

const registerSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterData) {
    try {
      await api.post("/user/register", data);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao cadastrar");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crie sua conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput label="Nome" name="name" register={register} error={errors.name} />
            <FormInput label="Email" name="email" register={register} error={errors.email} />
            <FormInput label="Senha" name="password" type="password" register={register} error={errors.password} />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Registrar"}
            </Button>
          </form>

          <p className="text-center text-sm mt-4">
            Já tem uma conta?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Faça login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
