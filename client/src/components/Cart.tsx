import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DrawerClose } from "./ui/drawer";
import { CartItemCard } from "./CartItemCard";
import { formatPrice } from "@/utils/formatters";
import { Button } from "./ui/button";
import { SelectAddress } from "./SelectAddress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAddress } from "@/services/address";
import { useState } from "react";
import { Address } from "@/types/Address";
import { createOrder, updateOrderStatus, getOrderById } from "@/services/order";
import { CartItem } from "@/types/CartItem";

export const Cart = () => {
    const { state, dispatch } = useCart();
    const queryClient = useQueryClient();

    const subtotal = state.items.reduce((acc, item) => acc + +item.product.price * item.quantity, 0);

    const { data: addresses } = useQuery({
        queryKey: ["address"],
        queryFn: getAddress,
        staleTime: Infinity,
    });

    const [selectedAddress, setSelectedAddress] = useState<null | Address>(null);
    const [orderId, setOrderId] = useState<number | null>(null);


    const { data: orderInfo } = useQuery({
        queryKey: ["order", orderId],
        queryFn: () => getOrderById(orderId!),
        enabled: !!orderId,
    });

    const createOrderMutation = useMutation({
        mutationFn: ({ addressId, items }: { addressId: number; items: CartItem[] }) =>
            createOrder(addressId, items),
        onSuccess: (data) => {
            if (data?.orderId) {
                setOrderId(data.orderId);
                console.log(orderId)
            } else {
                alert("Erro ao criar o pedido!");
            }
        },
    });


    const updateOrderMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => updateOrderStatus(id, status),
        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
        },
    });

    const finishCart = () => {
        if (!selectedAddress?.id) {
            alert("Selecione um endereço antes de finalizar a compra!");
            return;
        }
        createOrderMutation.mutate({ addressId: selectedAddress.id, items: state.items });
    };

    const handleUpdateStatus = (newStatus: string) => {
        if (!orderId) return;
        if(newStatus === 'PAYMENT_CONFIRMED'){
            queryClient.invalidateQueries({ queryKey: ["recommendations"] });
            state.items.forEach((productItem) => {
                dispatch({ type: "REMOVE_PRODUCT", payload: { product: productItem.product } })
            }) 
        }
        updateOrderMutation.mutate({ id: orderId, status: newStatus });
    };

    return (
        <div className="py-10 bg-[#252525] text-white h-full relative flex flex-col justify-between">
            <div>
                <DialogTitle className="text-center text-2xl text-primary">Meu carrinho</DialogTitle>
                <DrawerClose>
                    <div className="absolute cursor-pointer text-2xl font-bold right-4 top-2 text-red-500">X</div>
                </DrawerClose>

                {state.items.length === 0 && (
                    <div className="text-center h-full flex items-center justify-center text-2xl ">
                        Não há itens no carrinho
                    </div>
                )}

                <div className="mx-5 flex flex-col gap-3">
                    {state.items.map((item) => (
                        <CartItemCard key={item.product.id} item={item} />
                    ))}
                </div>
            </div>

            {state.items.length > 0 && (
                <div className="mx-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <p>Subtotal</p>
                        <p>{formatPrice(subtotal)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p>Taxa de entrega</p>
                        <p>{formatPrice(7)}</p>
                    </div>
                    <div className="flex items-center justify-between text-primary text-2xl">
                        <h3>Total</h3>
                        <p>{formatPrice(subtotal + 7)}</p>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="cursor-pointer text-xl py-6">Finalizar Compra</Button>
                        </DialogTrigger>

                        <DialogContent>
                            {!orderId ? (
                                <>
                                    <SelectAddress
                                        addresses={addresses}
                                        setSelected={setSelectedAddress}
                                        selected={selectedAddress}
                                    />
                                    <Button
                                        className="cursor-pointer w-full mt-3"
                                        onClick={finishCart}
                                        disabled={createOrderMutation.isPending}
                                    >
                                        {createOrderMutation.isPending ? "Finalizando..." : "Confirmar Compra"}
                                    </Button>
                                </>
                            ) : orderInfo ? (
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <h2 className="text-xl font-semibold text-primary">Pedido #{orderInfo.id}</h2>
                                    <p>
                                        Status atual: <span className="font-bold">{orderInfo.status}</span>
                                    </p>

                                    {orderInfo.status == "PENDING_PAYMENT" && (
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => handleUpdateStatus("PAYMENT_CONFIRMED")}
                                                disabled={updateOrderMutation.isPending}
                                            >
                                                Confirmar Pagamento
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleUpdateStatus("PAYMENT_FAILED")}
                                                disabled={updateOrderMutation.isPending}
                                            >
                                                Cancelar Pagamento
                                            </Button>
                                        </div>
                                    )}

                                    {orderInfo.status === "PAYMENT_CONFIRMED" && (
                                        <p className="text-green-400">✅ Pedido confirmado!</p>
                                    )}

                                    {orderInfo.status === "PAYMENT_FAILED" && (
                                        <p className="text-red-400">❌ Pedido cancelado.</p>
                                    )}
                                </div>
                            ) : (
                                <p>Carregando pedido...</p>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
};
