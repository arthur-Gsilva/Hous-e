import { notEqual } from "node:assert"
import { prisma } from "../libs/prisma"
import { CreateProduct, EditProduct } from "../types/product"

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

export const getAllProducts = async (query: string) => {
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ],
        }
    })

    return products.map(product => ({
        ...product,
        image: `products/${product.image}`,
    }))
}

