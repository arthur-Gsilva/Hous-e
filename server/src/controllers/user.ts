import { RequestHandler } from "express";
import { createUser, favoriteProduct, getProductsFavorites, getUserRecommendations, logUser } from "../services/user";
import { loginSchema } from "../schemas/login-user-schema";
import { registerSchema } from "../schemas/register-user-schema";
import { addAddressSchema } from "../schemas/add-address-schema";
import { addAddress, getAllAddresses } from "../services/address";
import { getProductIdSchema } from "../schemas/get-productId-schema";
import { getPriority } from "node:os";
import { getOneProduct } from "../services/products";
import { getAbsoluteImgUrl } from "../utils/absoluteImgUrl";

export const registerUserController: RequestHandler = async (req, res) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: "Email já cadastrado" });
        return;
    }

    const { name, email, password } = result.data;
    const user = await createUser(name, email, password);

    if (!user) {
        res.status(400).json({ error: "Dados incorretos" });
        return;
    }

    res.status(201).json({ error: null, user });
};

export const loginController: RequestHandler = async (req, res) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: "Dados inválidos" });
        return;
    }

    const { email, password } = result.data;
    const token = await logUser(email, password);

    if (!token) {
        res.status(401).json({ error: "Acesso negado" });
        return;
    }

    // Salvar o token em cookie HTTP-only
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.json({ error: null, message: "Login realizado com sucesso" });
};

export const logoutController: RequestHandler = async (req, res) => {
    res.clearCookie("accessToken");
    res.json({ message: "Logout efetuado com sucesso" });
};


export const addAddressController: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
    if(!userId){
        res.status(401).json({ error: "Acesso negado" })
        return
    }

    const result = addAddressSchema.safeParse(req.body)
    if(!result.success){
        res.status(400).json({error: 'Dados inválidos' })
        return
    }

    const address = await addAddress(parseInt(userId), result.data)
    if(!address){
        res.status(400).json({error: 'Erro detecado. Tente novamente', id: {userId} })
        return
    }
    res.status(201).json({ error: null, address })
}


export const getAddressesController: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
    if(!userId){
        res.status(401).json({ error: "Acesso negado" })
        return
    }

    const addresses = await getAllAddresses(parseInt(userId))
    res.json({ error: null, addresses })
}

export const favoriteProductController: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
    if(!userId){
        res.status(401).json({ error: "Acesso negado" })
        return
    }

    const result = getProductIdSchema.safeParse(req.params)
    if(!result.success){
        res.status(400).json({error: 'Dados inválidos' })
        return
    }
   
    try{
         const favorited = await favoriteProduct(parseInt(userId), result.data.productId)
        res.json({ favorited })
    } catch {
         res.status(400).json({ error: "produto não encontrado" })
    }
}

export const getFavoritesProductsController: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
    if(!userId){
        res.status(401).json({ error: "Acesso negado" })
        return
    }

    const favorites = await getProductsFavorites(parseInt(userId))

    const products = await Promise.all(
        favorites.map(async (favorite) => {
            const product = await getOneProduct(favorite.productId);
            return product;
        })
    );

    res.json({ products });
}

export const getProfileController: RequestHandler = async (req, res) => {
    const admin = req?.user?.admin; 
    res.json({ admin });
}


export const getRecommendationsController: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
    if(!userId){
        res.status(401).json({ error: "Acesso negado" })
        return
    }

    try {
        const recommendations = await getUserRecommendations(parseInt(userId));

        const productsWithAbsoluteUrl = recommendations.map(product => ({
            ...product,
            image: getAbsoluteImgUrl(product.image as string),
        }))
        res.json({ recommendations: productsWithAbsoluteUrl });
    } catch (error) {
    console.error(error);
        res.status(500).json({ error: "Erro ao gerar recomendações" });
    }
};