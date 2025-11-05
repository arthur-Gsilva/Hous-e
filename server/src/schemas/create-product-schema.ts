import z from "zod";

export const createProductSchema = z.object({
    name: z.string(),
    price: z.coerce.number(),
    stock: z.coerce.number(),
    description: z.string().optional(),
    categoryId: z.coerce.number()
})