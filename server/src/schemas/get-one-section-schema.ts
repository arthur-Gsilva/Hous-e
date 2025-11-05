import z from "zod"

export const getOneSectionSchema = z.object({
    id: z.string().regex(/^\d+$/)
})