import { prisma } from "../libs/prisma"

export const createCategory = async (name: string) => {
    return await prisma.category.create({
        data: {
            name
        }
    })
}

export const updateCategory = async (id: number, name: string) => {
    return await prisma.category.update({
        where: {id},
        data: {name}
    })
}

export const getAllCategories = async () => {
    return await prisma.category.findMany()
}