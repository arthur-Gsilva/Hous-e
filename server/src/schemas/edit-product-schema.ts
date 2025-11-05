import z from "zod";

export const editProductSchema = z.object({
    name: z.string().optional(),
    price: z.coerce.number().optional(),
    stock: z.coerce.number().optional(),
    description: z.string().optional(),
    categoryId: z.coerce.number().optional()
})