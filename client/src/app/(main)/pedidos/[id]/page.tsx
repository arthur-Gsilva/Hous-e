"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Order } from "@/types/order";
import api from "@/services/api";

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.id;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await api.get(`/order/${orderId}`, { withCredentials: true });
                setOrder(res.data.order);
            } catch (err) {
                console.error("Erro ao buscar pedido", err);
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin w-6 h-6 mr-2" />
                <span>Carregando pedido...</span>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">Pedido não encontrado.</p>
                <Link href="/orders">
                    <Button variant="outline" className="mt-4">Voltar</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl w-full mx-auto mt-10">
            <Card>
                <CardHeader className="pt-4">
                    <CardTitle className="flex justify-between items-center">
                        <span>Pedido #{order.id}</span>
                        <Badge>{order.status.replace("_", " ")}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Feito em {new Date(order.createdAt).toLocaleString("pt-BR")}
                    </p>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div>
                        <p>
                            <span className="font-semibold">Total:</span> R$ {order.total.toFixed(2)}
                        </p>
                        <p>
                            <span className="font-semibold">Frete:</span> R$ {order.shippingCost.toFixed(2)}
                        </p>
                    </div>

                    <div className="border-t pt-3">
                        <p className="font-semibold mb-1">Endereço de Entrega</p>
                        <p>
                            {order.shippingStreet}, {order.shippingNumber}
                            <br />
                            {order.shippingCity} - {order.shippingState}
                            <br />
                            {order.shippingCountry}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6 flex justify-end">
                <Link href="/pedidos">
                    <Button variant="outline">Voltar</Button>
                </Link>
            </div>
        </div>
    );
}
