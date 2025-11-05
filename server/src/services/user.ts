import { compare, hash } from "bcryptjs"
import { prisma } from "../libs/prisma"
import JWT from 'jsonwebtoken'

export const createUser = async (name: string, email: string, password: string) => {
    const existingEmail = await prisma.user.findUnique({ where: {email} })
    if(existingEmail) return null

    const hashPassword = await hash(password, 10)
    const user = await prisma.user.create({
        data: {
            name,
            email: email.toLowerCase(),
            password: hashPassword
        }
    })

    if(!user) return null

    return{
        id: user.id,
        name: user.name,
        email: user.email
    }
}

export const logUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if(!user) return null
    const validPassword = await compare(password, user.password)
    if(!validPassword) return null

    const token = JWT.sign(
        {id: user.id, email: user.email, admin: user.admin},
        process.env.JWT_SECRET_KEY as string
    )

    await prisma.user.update({
        where: {id: user.id},
        data: { token }
    })
    return token
}


export const getUserIdByToken = async (token: string) => {
    const user = await prisma.user.findFirst({
        where: {token}
    })

    if(!user) return null
    return user.id
}

export const favoriteProduct = async (userId: number, productId: number) => {
    const favorited = await prisma.favorite.create({
        data: {
            userId, productId
        }
    })

    return favorited
}

export const getProductsFavorites = async (userId: number) => {
    const favoriteProducts = await prisma.favorite.findMany({
        where: {
            userId
        },
        select: { productId: true }
    })

    return favoriteProducts
}