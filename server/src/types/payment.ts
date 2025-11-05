import { CartItem } from "./cartItem"

export type CreatePaymentLinkParams = {
    cart: CartItem[],
    shippingCost: number,
    orderId: number
}