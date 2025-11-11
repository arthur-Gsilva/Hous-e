import { prisma } from "../libs/prisma"
import { CreateProduct, EditProduct } from "../types/product"
import fs from "fs";
import path from "path";

const regrasPath = path.resolve(process.cwd(), "src/data/regras_apriori.json");
const regras: string[] = JSON.parse(fs.readFileSync(regrasPath, "utf-8"));

export const getOneProduct = async (id: number) => {
    const product = await prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            image: true,
            price: true,
            description: true,
            categoryId: true,
            Favorite: true,
            stock: true
        }
    })

    if(!product) return null

    return {
        ...product,
        image: `products/${product.image}`
    }
}


export const incrementProductView = async (id: number) => {
    await prisma.product.update({
        where: {id},
        data: {
            viewsCount: { increment: 1 }
        }
    })
}


export const getProductsByCategory = async (categoryId: number, id: number) => {
    const products = await prisma.product.findMany({
        where: {
            categoryId,
            NOT: {id}
        },
        select: {
            id: true,
            name: true,
            image: true,
            price: true,
            description: true,
            categoryId: true,
            Favorite: true
        },
        orderBy: {viewsCount: "desc" },
        
    })

    return products.map(product => ({
        ...product,
        image: `products/${product.image}`,
    }))
}


export const createProduct = async (data: CreateProduct, imagePath: string) => {
    return await prisma.product.create({
        data: {
            name: data.name,
            price: data.price,
            stock: data.stock,
            description: data.description,
            categoryId: Number(data.categoryId),
            image: imagePath
        }
    })
}

export const updateProduct = async (id: number, data: EditProduct) => {
    return await prisma.product.update({
        where: { id },
        data
    })
}

export const deleteProduct = async (id: number) => {
    return await prisma.product.delete({
        where: {id}
    })
}

export const getAllProducts = async (query: string, min: number, max: number) => {
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ],
            price: {
                gte: min,
                lte: max
            },
        }
    })

    return products.map(product => ({
        ...product,
        image: `products/${product.image}`,
    }))
}


export const getRelatedProductsByRules = async (productName: string) => {
    // 1️⃣ Busca regras onde o produto está na base (antecedente)
    const relacionadas = regras.filter((r: any) => r.base.includes(productName))

    // 2️⃣ Extrai todos os nomes dos produtos recomendados
    const recomendados = [...new Set(relacionadas.flatMap((r: any) => r.recomendados))]

    // 3️⃣ Busca esses produtos no banco (caso existam)
    const produtos = await prisma.product.findMany({
        where: {
            name: { in: recomendados }
        },
        select: {
            id: true,
            name: true,
            image: true,
            price: true,
            description: true,
            categoryId: true,
        }
    })

    // 4️⃣ Ajusta URLs de imagem e retorna
    return produtos.map(p => ({
        ...p,
        image: `products/${p.image}`
    }))
}