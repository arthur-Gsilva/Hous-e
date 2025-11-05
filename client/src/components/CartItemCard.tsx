import { CartItem } from "@/types/CartItem";
import { formatPrice } from "@/utils/formatters";
import Image from "next/image";
import { QuantityAction } from "./ui/QuantityAction";
import { useCart } from "@/contexts/CartContext";

type props = {
    item: CartItem
}

export const CartItemCard = ({item}: props) => {

    const { dispatch } = useCart();

    const handleChangeQuantity = (newValue: number) => {
        if (newValue > item.quantity) {
            dispatch({ type: "ADD_QUANTITY", payload: { product: item.product } });
        } else if (newValue < item.quantity) {
            dispatch({ type: "LOW_QUANTITY", payload: { product: item.product } });
        }
    };

    return(
        <div className="flex w-full bg-gray-100 text-black rounded-md pr-4 gap-2 border border-primary">
            <Image 
                src={item.product.image}
                alt={item.product.name}
                className="rounded-md"
                width={80}
                height={80}
                unoptimized
            />

            <div className="flex items-center justify-between flex-1">
                <div>
                    <h4>{item.product.name}</h4>
                    <h5 className="text-primary">{formatPrice(item.product.price * item.quantity)}</h5>
                </div>

                <QuantityAction 
                    value={item.quantity}
                    setValue={handleChangeQuantity}
                    inCart
                />
            </div>
        </div>
    )
}