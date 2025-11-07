import { CartItem } from "@/types/CartItem";
import api from "./api";

type Cart = {
    productId: number,
    quantity: number
}

type response = {
    addressId: number,
    url: string
}

export const createOrder = async (addressId: number, cartItem: CartItem[]) => {

    const cart: Cart[] = cartItem.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
    }));

    try{
        const response = await api.post('/cart/finish', {
            addressId,
            cart
        }) 

        console.log(response.data)
        return response.data
    } catch (err: any) {
      console.log(err.response?.data?.error || "Erro ao adicionar endereço");
    }
}

export const getOrderById = async (id: number) => {
  const response = await api.get(`/order/${id}`);
  console.log(response.data.order)
  return response.data.order;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  await api.post("/order/status", { orderId, status });
};