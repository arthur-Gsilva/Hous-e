import { RequestHandler } from "express";
import { getOneProductSchema } from "../schemas/get-one-product-schema";
import { createProduct, deleteProduct, getAllProducts, getOneProduct, getProductsByCategory, incrementProductView, updateProduct } from "../services/products";
import { getAbsoluteImgUrl } from "../utils/absoluteImgUrl";
import { createProductSchema } from "../schemas/create-product-schema";
import { editProductSchema } from "../schemas/edit-product-schema";

export const getOneProductController: RequestHandler = async (req, res) => {
    const paramsResult = getOneProductSchema.safeParse(req.params)
    if(!paramsResult.success){
        res.status(500).json({ error: 'Parâmetros inválidos' })
        return
    }

    const { id } = paramsResult.data

    const product = await getOneProduct(parseInt(id))
    if(!product){
        res.status(400).json({ error: "Produto inexistente." })
        return
    }

    const productWithAbsoluteUrl = {
        ...product,
        image: getAbsoluteImgUrl(product.image)
    }

    await incrementProductView(parseInt(id))

    res.json({ error: false, product: productWithAbsoluteUrl })
}

export const getRelatedProductsController: RequestHandler = async (req, res) => {
    const paramsResult = getOneProductSchema.safeParse(req.params)
    if(!paramsResult.success){
        res.status(500).json({ error: 'Parâmetros inválidos' })
        return
    }

    const { id } = paramsResult.data

    const products = await getProductsByCategory(parseInt(id))
    if(!products){
        res.status(400).json({ error: "Produtos não encontrados!" })
        return
    }

    const productsWithAbsoluteUrl = products.map(product => ({
        ...product,
        image: getAbsoluteImgUrl(product.image as string),
    }))

    res.json({ products: productsWithAbsoluteUrl })
}

export const createProductController: RequestHandler = async (req, res) => {
    const paramsResult = createProductSchema.safeParse(req.body)
    if(!paramsResult.success){
        res.status(500).json({ error: 'Parâmetros inválidos' })
        return
    }

    const imagePath = `${req.file?.filename}`

    const product = await createProduct(paramsResult.data, imagePath)

    if(!product){
        res.status(401).json({ error: "Erro ao criar o produto" })
    }


    res.status(201).json({ product })
}

export const updateProductController: RequestHandler = async (req, res) => {
    const paramsResult = getOneProductSchema.safeParse(req.params)
    const bodyResult = editProductSchema.safeParse(req.body)
    if(!paramsResult.success || !bodyResult.success){
        res.status(500).json({ error: 'Parâmetros inválidos' })
        return
    }

    const { id } = paramsResult.data

    try{
        await updateProduct(parseInt(id), bodyResult.data)
        res.json({ msg: "Produto editado com sucesso!" })
    } catch {
        res.status(400).json({ error: "Produto não encontrado" })
    }
}

export const deleteProductController: RequestHandler = async (req, res) => {
    const paramsResult = getOneProductSchema.safeParse(req.params)
    if(!paramsResult.success){
        res.status(500).json({ error: 'Parâmetros inválidos' })
        return
    }

    const { id } = paramsResult.data

    try{
        await deleteProduct(parseInt(id))
        res.json({ msg: "Produto deletado com sucesso!" })
    } catch{
        res.status(400).json({ error: "Produto não encontrado" })
    }
}

export const getAllProductController: RequestHandler = async (req, res) => {
    const products = await getAllProducts()

    const productsWithAbsoluteUrl = products.map(product => ({
        ...product,
        image: getAbsoluteImgUrl(product.image as string),
    }))

    res.json({ products: productsWithAbsoluteUrl })
}