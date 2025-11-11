"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProductSchema, AddProductFormInput, AddProductSchema } from "@/schemas/add-product-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { getCategories } from "@/services/category";
import { createProduct } from "@/services/product";
import { addProductInSection, getSections } from "@/services/section";

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient()

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 60000,
  });
  const { data: sections } = useQuery({
    queryKey: ["sections"],
    queryFn: getSections,
    staleTime: 60000,
  });


  const form = useForm<AddProductFormInput>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      price: "",
      stock: "",
      description: "",
      categoryId: "",
    },
  });

  const { register, handleSubmit, setValue, watch, reset, formState } = form;
  const { errors, isSubmitting } = formState;

  const mutation = useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    reset();
    setOpen(false);
  },
});

const onSubmit = async (formData: AddProductFormInput) => {
  const {secaoId, ...rest} = formData
  const parsed: AddProductSchema = {
    ...rest,
    price: Number(rest.price),
    stock: Number(rest.stock),
  };

  try {
    const createdProduct = await mutation.mutateAsync(parsed);
    console.log("Produto criado com ID:", createdProduct.product);
    await addProductInSection(createdProduct.product.id, formData.secaoId)
    queryClient.invalidateQueries({ queryKey: ['products'] })
  } catch (error) {
    console.error("Erro ao criar produto:", error);
  }
};

  const imageFile = watch("image");

  return (
      
      <>
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Preço</Label>
              <Input type="number" step="0.01" {...register("price")} />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div>
              <Label>Estoque</Label>
              <Input type="number" {...register("stock")} />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
            </div>
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea {...register("description")} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div className="flex w-full gap-5 items-center">
            <div>
              <Label>Categoria</Label>
              <Select
                onValueChange={(val) => setValue("categoryId", val)}
                value={watch("categoryId")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
            </div>

            <div>
              <Label>Seção</Label>
              <Select
                onValueChange={(val) => setValue("secaoId", val)}
                value={watch("secaoId")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma seção" />
                </SelectTrigger>
                <SelectContent>
                  {sections?.map((sec: any) => (
                    <SelectItem key={sec.id} value={String(sec.id)}>
                      {sec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.secaoId && <p className="text-red-500 text-sm">{errors.secaoId.message}</p>}
            </div>


          </div>

          <div>
            <Label>Imagem</Label>
            <Input type="file" accept="image/*" {...register("image")} />
            {imageFile && imageFile[0] && (
              <p className="text-sm text-gray-600 mt-1">{imageFile[0].name}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </>
    
  );
}
