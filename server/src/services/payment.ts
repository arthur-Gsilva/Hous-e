import { createStripeCheckouSection } from "../libs/stripe"
import { CartItem } from "../types/cartItem"
import { CreatePaymentLinkParams } from "../types/payment"

export const createPaymentLink = async ({cart, shippingCost, orderId}: CreatePaymentLinkParams) => {
    try{
        const session = await createStripeCheckouSection({ cart, shippingCost, orderId })
        if(!session.url) return null
        return session.url
    } catch (err) {
        console.error("Erro ao criar link de pagamento:", err)
        return null
    } 
    
}