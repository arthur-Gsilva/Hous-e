import Stripe from "stripe";
import { getOneProduct } from "../services/products";
import { CreatePaymentLinkParams } from "../types/payment";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export const createStripeCheckouSection = async ({cart, shippingCost, orderId}: CreatePaymentLinkParams) => {
    let stripeLineItem = []

    for(let item of cart){
        const product = await getOneProduct(item.productId)
        if(product){
            stripeLineItem.push({
                price_data: {
                    product_data: {
                        name: product.name
                    },
                    currency: 'BRL',
                    unit_amount: Math.round(product.price * 100)
                },
                quantity: item.quantity
            })
        }
    }

    if(shippingCost > 0){
        stripeLineItem.push({
            price_data: {
                product_data: {
                    name: 'Frete'
                },
                currency: 'BRL',
                unit_amount: Math.round(shippingCost * 100)
            },
            quantity: 1
        })
    }




    const session = await stripe.checkout.sessions.create({
        line_items: stripeLineItem,
        mode: 'payment',
        metadata: {orderId: orderId.toString()},
        success_url: `${process.env.FRONT_URL || ''}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONT_URL || ''}/meuspedidos`
    })

    return session
}