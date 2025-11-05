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
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha obrigatória"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const { refetchUser } = useAuth();

  async function onSubmit(data: LoginData) {
    try {
      await api.post("/user/login", data);
      refetchUser()
      router.push("/home");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao fazer login");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput label="Email" name="email" register={register} error={errors.email} />
            <FormInput label="Senha" name="password" type="password" register={register} error={errors.password} />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-sm mt-4">
            Não tem conta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Cadastre-se
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
