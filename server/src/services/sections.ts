import { prisma } from "../libs/prisma"

export const getAllSections = async () => {
    const sections = await prisma.section.findMany({
        select: {
            id: true,
            name: true,
            products: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    price: true,
                    description: true,
                    categoryId: true,
                    stock: true
                }
            }
        }
    })

    return sections.map(section => ({
        ...section,
        products: section.products.map(product => ({
            ...product,
            image: `products/${product.image}`
        }))
    }))
}

export const getOneSection = async (id: number) => {
    const section = await prisma.section.findUnique({
        where: {id},
        select: { id: true, name: true, products: true }
    })

    return section
}

export const createSection = async (name: string) => {
    return await prisma.section.create({
        data: {
            name
        }
    })
}

export const updateSection = async (id: number, name: string) => {
    return await prisma.section.update({
        where: {id},
        data: {name}
    })
}

export const addProductsToSection = async (id: number, productId: number) => {
    const section = await prisma.section.update({
        where: { id },
        data: {
            products: {
                connect: { id: productId }
            },
        },
        select: {
            id: true,
            name: true,
            products: true
        }
    })

    return section
}