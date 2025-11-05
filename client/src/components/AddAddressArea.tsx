"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";

const addAddressSchema = z.object({
    zipcode: z.string().min(1, "CEP obrigatório"),
    street: z.string().min(1, "Rua obrigatória"),
    number: z.string().min(1, "Número obrigatório"),
    city: z.string().min(1, "Cidade obrigatória"),
    state: z.string().min(1, "Estado obrigatório"),
    country: z.string().min(1, "País obrigatório"),
    complement: z.string().optional(),
});

type AddAddressData = z.infer<typeof addAddressSchema>;

export function AddAddressDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddAddressData>({ resolver: zodResolver(addAddressSchema) });
  
  const queryClient = useQueryClient()

  async function onSubmit(data: AddAddressData) {
    try {
      await api.post("/user/address", data, { withCredentials: true });
      setOpen(false);
      reset();
      setError("");
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['address'] })
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao adicionar endereço");
    }
  }

  return (

      <div className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Endereço</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="zipcode">CEP</Label>
              <Input id="zipcode" {...register("zipcode")} />
              {errors.zipcode && <p className="text-red-500 text-sm">{errors.zipcode.message}</p>}
            </div>

            <div>
              <Label htmlFor="number">Número</Label>
              <Input id="number" {...register("number")} />
              {errors.number && <p className="text-red-500 text-sm">{errors.number.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="street">Rua</Label>
            <Input id="street" {...register("street")} />
            {errors.street && <p className="text-red-500 text-sm">{errors.street.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" {...register("city")} />
              {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
            </div>

            <div>
              <Label htmlFor="state">Estado</Label>
              <Input id="state" {...register("state")} />
              {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="country">País</Label>
            <Input id="country" {...register("country")} />
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>

          <div>
            <Label htmlFor="complement">Complemento</Label>
            <Input id="complement" {...register("complement")} />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Endereço"}
            </Button>
          </div>
        </form>
      </div>
  
  );
}
