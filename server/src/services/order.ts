import { prisma } from "../libs/prisma"
import { Address } from "../types/address"
import { CartItem } from "../types/cartItem"
import { publishEvent } from "./kafka/producer"
import { getOneProduct } from "./products"

type OrderParams = {
    userId: number,
    address: Address,
    shippingCost: number,
    shippingDays: number,
    cart: CartItem[]
}

export const createOrder = async ({ userId, address, shippingCost, shippingDays, cart }: OrderParams) => {
    let subtotal = 0
    let orderItems = []

    for (let cartItem of cart){
        const product = await getOneProduct(cartItem.productId)

        if(product){
            if(product.stock < cartItem.quantity){
                throw new Error(`Estoque insuficiente`);
            }

            subtotal += product.price * cartItem.quantity

            orderItems.push({
                productId: product.id,
                quantity: cartItem.quantity,
                price: product.price
            })
        }
    }

    let total = subtotal + shippingCost

    const order = await prisma.order.create({
        data: {
            userId,
            total,
            shippingCost,
            shippingDays,
            shippingZipcode: address.zipcode,
            shippingCity: address.city,
            shippingCountry: address.country,
            shippingState: address.state,
            shippingNumber: address.number,
            shippingStreet: address.street,
            shippingComplemen: address.complement,
            orderItems: {
                create: orderItems
            }
        }
    })

    if(!order) return null

    return {
        id: order.id,
        total: order.total
    }
}


export const getOrderByUser = async (userId: number) => {
    const orders = await prisma.order.findMany({
        where: {
            userId
        }
    })

    return orders
}

export const getOneOrder = async (id: number) => {
    const order = await prisma.order.findUnique({
        where: {
            id
        }
    })

    return order
}

export const updateOrderStatus = async (orderId: number, status: string) => {
    await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status },
    })

    if (status === "PAYMENT_CONFIRMED") {
      await publishEvent("payment-confirmed", { orderId, status });
    } else if (status === "PAYMENT_FAILED") {
      await publishEvent("payment-failed", { orderId, status });
    }
}