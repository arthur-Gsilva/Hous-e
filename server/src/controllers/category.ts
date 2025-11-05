import { RequestHandler } from "express"
import { nameSchema } from "../schemas/name-schema"
import { createCategory, getAllCategories, updateCategory } from "../services/category"
import { getOneSectionSchema } from "../schemas/get-one-section-schema"

export const addCategoryController: RequestHandler = async (req, res) => {
    const paramsResult = nameSchema.safeParse(req.body)
    if(!paramsResult.success){
        res.status(500).json({ error: 'Parâmetros inválidos' })
        return
    }

    const { name } = paramsResult.data

    const category = await createCategory(name)

    res.status(201).json({ category })
}

export const updateCategoryController: RequestHandler = async (req, res) => {
    const paramsResult = getOneSectionSchema.safeParse(req.params)
    const bodyResult = nameSchema.safeParse(req.body)
    if(!paramsResult.success || !bodyResult.success){
        res.status(500).json({ error: 'Parâmetros inválidos' })
        return
    }

    const { id } = paramsResult.data
    const { name } = bodyResult.data

    const category = await updateCategory(parseInt(id), name)

    res.status(201).json({ category })
}

export const getAllCategoriesController: RequestHandler = async (req, res) => {
    const categories = await getAllCategories()

    res.json({ categories })
}