import z from "zod";

export const getProductIdSchema = z.object({
    productId: z.coerce.number(),
})