import { RequestHandler } from "express";
import { addProductsToSection, createSection, getAllSections, getOneSection, updateSection } from "../services/sections";
import { getOneSectionSchema } from "../schemas/get-one-section-schema";
import { getAbsoluteImgUrl } from "../utils/absoluteImgUrl";
import { nameSchema } from "../schemas/name-schema";
import { cartMountSchema } from "../schemas/cart-mount-schema";
import { getProductIdSchema } from "../schemas/get-productId-schema";

export const getAllSectionsController: RequestHandler = async (req, res) => {
    try {
        const sections = await getAllSections()

        const sectionsWithAbsoluteImages = sections.map(section => ({
            ...section,
            products: section.products.map(product => ({
                ...product,
                image: getAbsoluteImgUrl(product.image)
            }))
        }))

        res.json({ sections: sectionsWithAbsoluteImages })
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar seções' })
    }
}

export const getOneSectionController: RequestHandler = async (req, res) => {
    const paramsResult = getOneSectionSchema.safeParse(req.params)
    if(!paramsResult.success){
        res.status(500).json({ error: 'Parâmetros inválidos' })
        return
    }

    const { id } = paramsResult.data

    const section = await getOneSection(parseInt(id))

    if(!section){
        res.status(400).json({ error: "Paramêtros inválidos" })
        return
    }

    const productsWithAbsoluteUrl = section.products.map(product => ({
        ...product,
        image: getAbsoluteImgUrl(product.image as string),
    }))

    res.json({ id: section.id, name: section.name, products: productsWithAbsoluteUrl })
}

export const addSectionController: RequestHandler = async (req, res) => {
    const paramsResult = nameSchema.safeParse(req.body)
    if(!paramsResult.success){
        res.status(500).json({ error: 'Parâmetros inválidos' })
        return
    }

    const { name } = paramsResult.data

    const section = await createSection(name)

    res.status(201).json({ section })
}

export const updateSectionController: RequestHandler = async (req, res) => {
    const paramsResult = getOneSectionSchema.safeParse(req.params)
    const bodyResult = nameSchema.safeParse(req.body)
    if(!paramsResult.success || !bodyResult.success){
        res.status(500).json({ error: 'Parâmetros inválidos' })
        return
    }

    const { id } = paramsResult.data
    const { name } = bodyResult.data

    const section = await updateSection(parseInt(id), name)

    res.status(201).json({ section })
}

export const addProductToSectionController: RequestHandler = async (req, res) => {
    const bodyResult = getProductIdSchema.safeParse(req.body)
    const paramsResult = getOneSectionSchema.safeParse(req.params)
    if(!paramsResult.success || !bodyResult.success){
        res.status(400).json({ error: "Parâmetros inválidos" })
        return
    }

    const {id} = paramsResult.data
    const {productId} = bodyResult.data

    const section = await addProductsToSection(parseInt(id), productId)

    if(!section){
        res.status(400).json({ error: 'Seção não encontrada' })
    }

    res.status(200).json({ section })
}