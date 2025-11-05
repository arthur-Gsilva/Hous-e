import { RequestHandler } from "express";
import { getAbsoluteImgUrl } from "../utils/absoluteImgUrl";
import { getOneProduct } from "../services/products";
import { cartMountSchema } from "../schemas/cart-mount-schema";
import { cartFinishSchema } from "../schemas/cart-finish-schema";
import { createOrder } from "../services/order";
import { getAddressById } from "../services/address";
import { createPaymentLink } from "../services/payment";
import { publishEvent } from "../services/kafka/producer";

export const cartMountController: RequestHandler = async (req, res) => {
    const parseResult = cartMountSchema.safeParse(req.body)
    if(!parseResult.success){
        res.status(400).json({ error: "Array de Ids inválidos" })
        return
    }

    const { ids } = parseResult.data

    let products = []

    for(let id of ids){
        const product = await getOneProduct(id)
        if(product){
            products.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: getAbsoluteImgUrl(product.image)
            })
        }
    }

    res.json({ products })
}


export const finishCartController: RequestHandler = async (req, res) => {
     const userId = req.user?.id;
    if(!userId){
        res.status(401).json({ error: "Acesso negado" })
        return
    }

    const result = cartFinishSchema.safeParse(req.body)
    if(!result.success){
        res.status(400).json({ error: "Carrinho inexistente" })
        return
    }

    const { cart, addressId } = result.data

    const address = await getAddressById(parseInt(userId), addressId)

    if(!address){
        res.status(400).json({ error: "Endereço inválido" })
        return
    }

    const shippingCost = 7
    const shippingDays = 3

    const order = await createOrder({
        userId: parseInt(userId),
        address,
        shippingCost,
        shippingDays,
        cart
    })

    if(!order){
        res.status(401).json({ error: "ocorreu um erro" })
        return
    }

    await publishEvent("order-created", {
        orderId: order.id,
        userId,
        status: "PENDING_PAYMENT",
        totalItems: cart.length,
        totalValue: order.total
    })

    const url = await createPaymentLink({
        cart, shippingCost, orderId: order.id
    })

    if(!url){
        res.status(401).json({ error: "ocorreu um erro" })
        return
    }

    res.status(201).json({ error: null, orderId: order.id, url })
}