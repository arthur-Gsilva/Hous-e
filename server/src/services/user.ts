import { compare, hash } from "bcryptjs"
import { prisma } from "../libs/prisma"
import JWT from 'jsonwebtoken'

import fs from "fs";
import path from "path";

const regrasPath = path.resolve(process.cwd(), "src/data/regras_apriori.json");
const regras: string[] = JSON.parse(fs.readFileSync(regrasPath, "utf-8"));

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


export const getUserRecommendations = async (userId: number) => {
    const compras = await prisma.orderProduct.findMany({
        where: {
            order: {
                is: {
                    userId: userId
                }
            }
        },
        include: {
            product: true,
        }
    });

    if (compras.length === 0) return [];

    // Normaliza nomes (trim e lowercase)
    const produtosComprados = compras.map(c =>
        c.product.name.trim().toLowerCase()
    );

    // 2️⃣ Gerar recomendações a partir das regras
    const recomendados: string[] = [];

    for (const regra of regras) {
        //@ts-ignore
        const base = (regra.base || []).map((p: string) => p.trim().toLowerCase());
        //@ts-ignore
        const consequents = (regra.recomendados || []).map((p: string) => p.trim().toLowerCase());

        // Se o usuário tiver comprado qualquer produto da base → recomendar
        //@ts-ignore
        if (base.some(p => produtosComprados.includes(p))) {
            recomendados.push(...consequents);
        }
    }

    // 3️⃣ Remover duplicados e produtos já comprados
    const produtosFiltrados = [...new Set(recomendados)].filter(
        p => !produtosComprados.includes(p)
    );

    if (produtosFiltrados.length === 0) return [];

    // 4️⃣ Buscar produtos no banco (comparando com nomes normalizados)
    const allProducts = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            image: true,
            description: true
        }
    });

    const produtos = allProducts.filter(p =>
        produtosFiltrados.includes(p.name.trim().toLowerCase())
    );

    // 5️⃣ Retornar com URLs ajustadas
    return produtos.map(p => ({
        ...p,
        image: `products/${p.image}`
    }));
};