import { z } from "zod";


export const addProductSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  price: z
    .string()
    .min(1, "Preço obrigatório.")
    .refine((val) => !isNaN(Number(val)), "Preço inválido."),
  stock: z
    .string()
    .min(1, "Estoque obrigatório.")
    .refine((val) => !isNaN(Number(val)), "Estoque inválido."),
  description: z.string().min(5, "Descrição muito curta."),
  categoryId: z.string().min(1, "Categoria obrigatória."),
  secaoId: z.string().min(1, "Seção obrigatória."),
  image: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file || file instanceof FileList || file instanceof File,
      "Formato de imagem inválido"
    ),
});


export type AddProductFormInput = z.input<typeof addProductSchema>;


export type AddProductSchema = {
  name: string;
  price: number;
  stock: number;
  description: string;
  categoryId: string;
  image?: FileList;
};
